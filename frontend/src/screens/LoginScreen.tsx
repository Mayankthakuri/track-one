import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import authService from '../services/auth'

export default function LoginScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('test1@example.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      if (isSignUp) {
        if (!fullName || !phone) {
          Alert.alert('Error', 'Please fill in all fields')
          return
        }
        const { error } = await authService.signUp({
          email,
          password,
          fullName,
          phone,
        })
        if (error) throw new Error(error)
        Alert.alert('Success', 'Account created! Please log in.')
        setIsSignUp(false)
        setPassword('')
      } else {
        const { error } = await authService.signIn({ email, password })
        if (error) throw new Error(error)
        onSuccess?.()
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TrackOne</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Text>

        {isSignUp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
})
