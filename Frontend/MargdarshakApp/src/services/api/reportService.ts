import apiClient from './client';
import { Category, Report, ReportCreate, VoteRequest, VoteResponse } from './types';

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

  async createReportWithImage(
    data: ReportCreate,
    imageUri: string
  ): Promise<string> {
    const formData = new FormData();
    
    // Add all required fields
    formData.append('category_id', data.category_id.toString());
    formData.append('user_rating', data.user_rating.toString());
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }

    // Only add image if URI is provided and not empty
    if (imageUri && imageUri.trim()) {
      const filename = imageUri.split('/').pop() || 'incident.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('incident_image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    console.log('📤 Uploading report with image...');
    const response = await apiClient.post<string>('/reports/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
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
    const payload: VoteRequest = { vote_type: voteType };
    const response = await apiClient.post<VoteResponse>(`/reports/${reportId}/vote`, payload);
    return response.data;
  }
}

export default new ReportService();
