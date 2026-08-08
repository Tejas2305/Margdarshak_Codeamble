import apiClient from './client';
import {
  LocationPoint,
  RouteSafetyRequest,
  RouteSafetyResponse,
  SpeedLimitResponse,
} from './types';

class MapService {
  async getSpeedLimit(params: {
    lat?: number;
    lng?: number;
    segment_id?: number;
  }): Promise<SpeedLimitResponse> {
    const response = await apiClient.get<SpeedLimitResponse>('/map/speed-limit', {
      params,
    });
    return response.data;
  }

  async analyzeRouteSafety(
    origin: LocationPoint,
    destination: LocationPoint
  ): Promise<RouteSafetyResponse> {
    const payload: RouteSafetyRequest = { origin, destination };
    const response = await apiClient.post<RouteSafetyResponse>('/map/route-safety', payload);
    return response.data;
  }
}

export default new MapService();
