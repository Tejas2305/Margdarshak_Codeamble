import apiClient from './client';
import { RootResponse } from './types';

class SystemService {
  /**
   * Calls backend root endpoint to verify service availability.
   */
  async healthCheck(): Promise<RootResponse> {
    const response = await apiClient.get<RootResponse>('/');
    return response.data;
  }
}

export default new SystemService();