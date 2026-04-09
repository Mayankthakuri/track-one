import supabase from './supabase'

export interface Contact {
  id: string
  userId: string
  contactPhone: string
  contactName?: string
  contactUserId?: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: string
}

export interface ContactRequest {
  id: string
  fromUserId: string
  toUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

class ContactService {
  async getContacts() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          contact_user:contact_user_id(id, email, full_name, latitude, longitude, last_location_update)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted')

      if (error) throw error
      return { contacts: data, error: null }
    } catch (error: any) {
      return { contacts: [], error: error.message }
    }
  }

  async addContact(contactPhone: string, contactName?: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      // Find user by phone
      const { data: contactUser, error: contactError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', contactPhone)
        .single()
      if (contactError && contactError.code !== 'PGRST116') throw contactError

      // Check if contact already exists
      const { data: existingContact, error: existsError } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('contact_phone', contactPhone)
        .single()
      if (existsError && existsError.code !== 'PGRST116') throw existsError

      if (existingContact) {
        throw new Error('Contact already exists')
      }

      // Add contact
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_phone: contactPhone,
          contact_name: contactName || contactPhone,
          contact_user_id: contactUser?.id || null,
          status: 'accepted',
        })
        .select()

      if (error) throw error

      // Send contact request to the other user if they exist
      if (contactUser?.id) {
        try {
          await supabase.from('contact_requests').insert({
            from_user_id: user.id,
            to_user_id: contactUser.id,
            status: 'pending',
          })
        } catch {
          // Ignore error if request already exists
        }
      }

      return { contact: data?.[0], error: null }
    } catch (error: any) {
      return { contact: null, error: error.message }
    }
  }

  async removeContact(contactId: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async getContactRequests() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('contact_requests')
        .select(`
          *,
          from_user:from_user_id(id, email, full_name, phone)
        `)
        .eq('to_user_id', user.id)
        .eq('status', 'pending')

      if (error) throw error
      return { requests: data, error: null }
    } catch (error: any) {
      return { requests: [], error: error.message }
    }
  }

  async acceptContactRequest(requestId: string, fromUserId: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      // Update request status
      await supabase
        .from('contact_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)

      // Add mutual contacts
      const { data: fromUser } = await supabase
        .from('users')
        .select('phone, full_name')
        .eq('id', fromUserId)
        .single()

      if (fromUser?.phone) {
        await supabase.from('contacts').insert({
          user_id: user.id,
          contact_phone: fromUser.phone,
          contact_name: fromUser.full_name || fromUser.phone,
          contact_user_id: fromUserId,
          status: 'accepted',
        })

        await supabase.from('contacts').insert({
          user_id: fromUserId,
          contact_phone: (await supabase.auth.getUser()).data.user?.user_metadata?.phone || '',
          contact_user_id: user.id,
          status: 'accepted',
        })
      }

      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async rejectContactRequest(requestId: string) {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async subscribeToContacts(userId: string, callback: (contact: Contact) => void) {
    try {
      // Using the new Supabase realtime syntax
      const subscription = supabase
        .channel(`contacts:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contacts',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            callback(payload.new as Contact)
          }
        )
        .subscribe()

      return { subscription, error: null }
    } catch (error: any) {
      return { subscription: null, error: error.message }
    }
  }
}

export default new ContactService()
