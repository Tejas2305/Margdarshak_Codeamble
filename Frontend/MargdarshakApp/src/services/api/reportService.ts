import apiClient from './client';
import { Category } from './types';

class ReportService {
  /**
   * Get all report categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/reports/categories');
    return response.data;
  }
}

export default new ReportService();
