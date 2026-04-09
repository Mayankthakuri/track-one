import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NavigationContainer, NavigationProp } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LoginScreen from './src/screens/LoginScreen'
import MapScreen from './src/screens/MapScreen'
import ContactsScreen from './src/screens/ContactsScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import authService from './src/services/auth'

export type RootTabParamList = {
  Map: undefined
  Contacts: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<RootTabParamList>()

export default function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { user } = await authService.getCurrentUser()
      setIsAuthenticated(!!user)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen onSuccess={() => setIsAuthenticated(true)} />
    )
  }

  return (
    <NavigationContainer fallback={<ActivityIndicator />} {...({} as any)}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'map'

            if (route.name === 'Map') {
              iconName = 'map'
            } else if (route.name === 'Contacts') {
              iconName = 'contacts'
            } else if (route.name === 'Profile') {
              iconName = 'account'
            }

            return (
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            )
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          headerShown: true,
        })}
      >
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'Location Track',
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            title: 'Contacts',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={() => (
            <ProfileScreen onLogout={() => setIsAuthenticated(false)} />
          )}
          options={{
            title: 'Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  ) as React.JSX.Element
}
