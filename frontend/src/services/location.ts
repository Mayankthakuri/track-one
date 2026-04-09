import supabase from './supabase'

export interface Location {
  id: string
  userId: string
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  phone?: string
  latitude?: number
  longitude?: number
  lastLocationUpdate?: string
  createdAt: string
}

class LocationService {
  async updateUserLocation(latitude: number, longitude: number, accuracy?: number) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      // Insert into locations table
      const { error: insertError } = await supabase
        .from('locations')
        .insert({
          user_id: user.id,
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        })

      if (insertError) throw insertError

      // Also insert into location_history for trail
      await supabase
        .from('location_history')
        .insert({
          user_id: user.id,
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        })

      // Update users table with latest location
      await supabase
        .from('users')
        .update({
          latitude,
          longitude,
          last_location_update: new Date().toISOString(),
        })
        .eq('id', user.id)

      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async getLatestLocation(userId: string) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { location: (data as Location) || null, error: null }
    } catch (error: any) {
      return { location: null, error: error.message }
    }
  }

  async getLocationHistory(userId: string, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('location_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { locations: data as Location[], error: null }
    } catch (error: any) {
      return { locations: [], error: error.message }
    }
  }

  async subscribeToLocationUpdates(userId: string, callback: (location: Location) => void) {
    try {
      // Using the new Supabase realtime syntax
      const subscription = supabase
        .channel(`locations:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'locations',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            callback(payload.new as Location)
          }
        )
        .subscribe()

      return { subscription, error: null }
    } catch (error: any) {
      return { subscription: null, error: error.message }
    }
  }
}

export default new LocationService()
