import supabase from './supabase'

export interface AuthUser {
  id: string
  email: string
}

export interface SignUpInput {
  email: string
  password: string
  fullName?: string
  phone?: string
}

export interface SignInInput {
  email: string
  password: string
}

class AuthService {
  async signUp({ email, password, fullName, phone }: SignUpInput) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Update user profile after a short delay to ensure user record exists
      if (data.user) {
        setTimeout(async () => {
          try {
            await supabase.from('users').update({
              full_name: fullName || null,
              phone: phone || null,
            }).eq('id', data.user!.id)
          } catch (err) {
            console.error('Profile update error:', err)
          }
        }, 1000)
      }

      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  async signIn({ email, password }: SignInInput) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}

export default new AuthService()
