import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import locationService, { Location as LocationType } from '../services/location'
import contactService, { Contact } from '../services/contact'
import authService from '../services/auth'

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [locationHistory, setLocationHistory] = useState<LocationType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const locationSubscriptionRef = React.useRef<any>(null)

  useEffect(() => {
    initializeMap()
  }, [])

  const initializeMap = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required')
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      setUserLocation({ latitude, longitude })
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })

      // Update location in database
      await locationService.updateUserLocation(latitude, longitude)

      // Load contacts
      const { contacts: contactsList } = await contactService.getContacts()
      setContacts(contactsList || [])

      // Get current user to load their location history
      const { user } = await authService.getCurrentUser()
      if (user) {
        // Load location history for current user
        const { locations } = await locationService.getLocationHistory(user.id)
        setLocationHistory(locations || [])
      }

      setIsLoading(false)
    } catch (error: any) {
      Alert.alert('Error', error.message)
      setIsLoading(false)
    }
  }

  const toggleTracking = async () => {
    try {
      if (!trackingEnabled) {
        setTrackingEnabled(true)
        // Start periodic location updates
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 120000, // 2 minutes
            distanceInterval: 10, // 10 meters
          },
          async (location) => {
            const { latitude, longitude } = location.coords
            setUserLocation({ latitude, longitude })
            await locationService.updateUserLocation(latitude, longitude)
          }
        )

        // Store subscription in ref for cleanup
        locationSubscriptionRef.current = subscription
      } else {
        setTrackingEnabled(false)
        // Stop tracking
        if (locationSubscriptionRef.current) {
          await locationSubscriptionRef.current.remove()
          locationSubscriptionRef.current = null
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  // Clean up subscription on component unmount
  React.useEffect(() => {
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove().catch(() => {})
      }
    }
  }, [])

  const coordinatesToPolyline = (coords: LocationType[]) => {
    return coords
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }))
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="#007AFF"
          />
        )}

        {/* Contacts location markers */}
        {contacts.map((contact) => (
          <Marker
            identifier={contact.id}
            coordinate={{
              latitude: contact.contact_user?.latitude || 0,
              longitude: contact.contact_user?.longitude || 0,
            }}
            title={contact.contact_name || contact.contact_phone}
            pinColor="#34C759"
          />
        ))}

        {/* Location history polyline */}
        {locationHistory.length > 0 && (
          <Polyline
            coordinates={coordinatesToPolyline(locationHistory)}
            strokeColor="#FF3B30"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, trackingEnabled && styles.buttonActive]}
          onPress={toggleTracking}
        >
          <Text style={styles.buttonText}>
            {trackingEnabled ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
