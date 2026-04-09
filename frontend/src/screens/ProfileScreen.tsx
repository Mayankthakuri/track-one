import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import supabase from '../services/supabase'
import authService from '../services/auth'

export default function ProfileScreen({ onLogout }: { onLogout?: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { user: authUser } = await authService.getCurrentUser()
      if (authUser) {
        setUser(authUser)

        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        setProfile(data)
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            const { error } = await authService.signOut()
            if (error) throw new Error(error)
            onLogout?.()
          } catch (error: any) {
            Alert.alert('Error', error.message)
          }
        },
        style: 'destructive',
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile?.phone || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Current Location</Text>
            <Text style={styles.value}>
              {profile?.latitude && profile?.longitude
                ? `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`
                : 'Not available'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Update</Text>
            <Text style={styles.value}>
              {profile?.last_location_update
                ? new Date(profile.last_location_update).toLocaleString()
                : 'Never'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Created</Text>
            <Text style={styles.value}>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <Text style={styles.securityText}>
            ✓ Your location is only visible to your accepted contacts
          </Text>
          <Text style={styles.securityText}>
            ✓ Passwords are encrypted with bcrypt
          </Text>
          <Text style={styles.securityText}>
            ✓ All communications use secure HTTPS
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
