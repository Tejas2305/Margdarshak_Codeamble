import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { emergencyContactService } from '../../services/api';
import { EmergencyContact } from '../../services/api/types';

export default function EmergencyContactsScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const result = await emergencyContactService.getContacts();
      setContacts(result);
    } catch (error: any) {
      Alert.alert('Load Failed', error?.response?.data?.detail || 'Unable to load emergency contacts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setName('');
    setPhoneNumber('');
    setShowModal(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhoneNumber(contact.phone_number);
    setShowModal(true);
  };

  const handleSaveContact = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      Alert.alert('Missing Details', 'Please enter both name and phone number.');
      return;
    }

    try {
      setIsSaving(true);

      if (editingContact) {
        // Update existing contact
        await emergencyContactService.updateContact({
          contact_id: editingContact.contact_id,
          name: name.trim(),
          phone_number: phoneNumber.trim(),
        });
        Alert.alert('Success', 'Emergency contact updated successfully!');
      } else {
        // Create new contact
        await emergencyContactService.createContact({
          name: name.trim(),
          phone_number: phoneNumber.trim(),
        });
        Alert.alert('Success', 'Emergency contact added successfully!');
      }

      setShowModal(false);
      setName('');
      setPhoneNumber('');
      setEditingContact(null);
      await loadContacts();
    } catch (error: any) {
      Alert.alert('Save Failed', error?.response?.data?.detail || 'Unable to save emergency contact.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = (contact: EmergencyContact) => {
    Alert.alert('Delete Contact', `Remove ${contact.name} from emergency contacts?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await emergencyContactService.deleteContact(contact.contact_id);
            Alert.alert('Deleted', 'Emergency contact removed successfully.');
            await loadContacts();
          } catch (error: any) {
            Alert.alert('Delete Failed', error?.response?.data?.detail || 'Unable to delete emergency contact.');
          }
        },
      },
    ]);
  };

  const closeModal = () => {
    setShowModal(false);
    setName('');
    setPhoneNumber('');
    setEditingContact(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Emergency Contacts</Text>
        <TouchableOpacity onPress={handleAddContact} style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading contacts...</Text>
          </View>
        ) : contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Emergency Contacts</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Add trusted contacts who will be notified during emergencies
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={handleAddContact}
            >
              <Text style={styles.emptyButtonText}>Add Your First Contact</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              These contacts will be notified when you trigger an SOS alert
            </Text>

            {contacts.map((contact) => (
              <View
                key={contact.contact_id}
                style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{contact.phone_number}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.background }]}
                    onPress={() => handleEditContact(contact)}
                  >
                    <MaterialCommunityIcons name="pencil" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.background }]}
                    onPress={() => handleDeleteContact(contact)}
                  >
                    <MaterialCommunityIcons name="delete" size={18} color="#EA4335" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              {editingContact
                ? 'Update the emergency contact details'
                : 'Add a trusted person who will be notified during emergencies'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter contact name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="+1234567890"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }, (!name.trim() || !phoneNumber.trim() || isSaving) && styles.saveButtonDisabled]}
              onPress={handleSaveContact}
              disabled={!name.trim() || !phoneNumber.trim() || isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : editingContact ? 'Update Contact' : 'Add Contact'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '400',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});
