import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment or app.json
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase
