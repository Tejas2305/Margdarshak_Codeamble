import apiClient from './client';
import {
  LocationPoint,
  RouteSafetyRequest,
  RouteSafetyResponse,
  SpeedLimitResponse,
  SearchPlaceResponse,
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
    console.log('🔵 mapService.analyzeRouteSafety called');
    console.log('   Origin:', origin);
    console.log('   Destination:', destination);
    
    const payload: RouteSafetyRequest = { origin, destination };
    console.log('   Payload:', JSON.stringify(payload));
    
    const response = await apiClient.post<RouteSafetyResponse>('/map/route-safety', payload);
    
    console.log('   Response status:', response.status);
    console.log('   Response data:', response.data);
    
    return response.data;
  }

  async searchPlaces(
    query: string,
    lat?: number,
    lng?: number,
    limit: number = 10
  ): Promise<SearchPlaceResponse> {
    const params: any = { query, limit };
    if (lat !== undefined && lng !== undefined) {
      params.lat = lat;
      params.lng = lng;
    }
    const response = await apiClient.get<SearchPlaceResponse>('/map/search', {
      params,
    });
    return response.data;
  }
}

export default new MapService();
