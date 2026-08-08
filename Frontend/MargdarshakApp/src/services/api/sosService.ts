import apiClient from './client';
import { SosHistoryItem, SosResponse, SosTriggerRequest } from './types';

class SosService {
  async trigger(data: SosTriggerRequest): Promise<SosResponse> {
    const response = await apiClient.post<SosResponse>('/sos/trigger', data);
    return response.data;
  }

  async getHistory(): Promise<SosHistoryItem[]> {
    const response = await apiClient.get<SosHistoryItem[]>('/sos/history');
    return response.data;
  }
}

export default new SosService();
