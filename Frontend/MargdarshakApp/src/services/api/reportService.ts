import apiClient from './client';
import { Category, Report, ReportCreate, VoteResponse } from './types';

class ReportService {
  /**
   * Get all report categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/reports/categories');
    return response.data;
  }

  async createReport(data: ReportCreate): Promise<Report> {
    const response = await apiClient.post<Report>('/reports/create', data);
    return response.data;
  }

  async getMyReports(page = 1, limit = 10): Promise<Report[]> {
    const response = await apiClient.get<Report[]>('/reports/my-reports', {
      params: { page, limit },
    });
    return response.data;
  }

  async getNearbyReports(lat: number, lng: number, radius = 5000): Promise<Report[]> {
    const response = await apiClient.get<Report[]>('/reports/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  }

  async voteReport(reportId: number, voteType: 1 | -1): Promise<VoteResponse> {
    const response = await apiClient.post<VoteResponse>(`/reports/${reportId}/vote`, {
      vote_type: voteType,
    });
    return response.data;
  }
}

export default new ReportService();
