import apiClient from './client';
import {
  EmergencyContact,
  EmergencyContactCreate,
  EmergencyContactUpdate,
  EmergencyContactResponse,
} from './types';

class EmergencyContactService {
  /**
   * Get all emergency contacts
   */
  async getContacts(): Promise<EmergencyContact[]> {
    const response = await apiClient.get<EmergencyContact[]>('/user/emergency-contacts');
    return response.data;
  }

  /**
   * Create new emergency contact
   */
  async createContact(data: EmergencyContactCreate): Promise<EmergencyContactResponse> {
    const response = await apiClient.post<EmergencyContactResponse>(
      '/user/emergency-contacts',
      data
    );
    return response.data;
  }

  /**
   * Update emergency contact
   */
  async updateContact(data: EmergencyContactUpdate): Promise<EmergencyContactResponse> {
    const response = await apiClient.put<EmergencyContactResponse>(
      '/user/emergency-contacts',
      data
    );
    return response.data;
  }

  /**
   * Delete emergency contact
   */
  async deleteContact(contactId: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/user/emergency-contacts/${contactId}`
    );
    return response.data;
  }
}

export default new EmergencyContactService();
