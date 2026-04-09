import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native'
import contactService, { Contact } from '../services/contact'

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([])
  const [newPhone, setNewPhone] = useState('')
  const [newName, setNewName] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setIsLoading(true)
      const { contacts: loadedContacts } = await contactService.getContacts()
      setContacts(loadedContacts || [])
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddContact = async () => {
    if (!newPhone) {
      Alert.alert('Error', 'Please enter a phone number')
      return
    }

    try {
      const { error } = await contactService.addContact(newPhone, newName)
      if (error) throw new Error(error)

      Alert.alert('Success', 'Contact added!')
      setNewPhone('')
      setNewName('')
      setIsModalVisible(false)
      await loadContacts()
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  const handleRemoveContact = async (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const { error } = await contactService.removeContact(contactId)
              if (error) throw new Error(error)
              await loadContacts()
            } catch (error: any) {
              Alert.alert('Error', error.message)
            }
          },
          style: 'destructive',
        },
      ]
    )
  }

  const renderContact = ({ item }: { item: any }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>
          {item.contact_name || item.contact_phone}
        </Text>
        <Text style={styles.contactPhone}>{item.contact_phone}</Text>
        <Text style={styles.contactEmail}>{item.contact_user?.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveContact(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No contacts yet</Text>
            <Text style={styles.emptySubtext}>Add contacts to start sharing locations</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Contact</Text>

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Name (optional)"
              value={newName}
              onChangeText={setNewName}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAddContact}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  contactEmail: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
})
