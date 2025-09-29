import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { TataRuangForm } from '~/types/formData';

// API base configuration
const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    console.error('❌ Full Error Response:', error.response);
    console.error('❌ Request Data that failed:', error.config?.data);
    return Promise.reject(error);
  }
);

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.baseURL + config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Spatial Planning (Tata Ruang) API
export const spatialPlanningApi = {
  submit: async (data: TataRuangForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {
    console.log('🚀 Submitting Spatial Planning Data:', data);

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add all text fields
    formData.append('reporter_name', data.reporter_name);
    formData.append('institution', data.institution);
    formData.append('phone_number', data.phone_number);
    formData.append('report_datetime', data.report_datetime);
    formData.append('area_description', data.area_description);
    formData.append('area_category', data.area_category);
    formData.append('violation_type', data.violation_type);
    formData.append('violation_level', data.violation_level);
    formData.append('environmental_impact', data.environmental_impact);
    formData.append('urgency_level', data.tingkatUrgensi || ''); // Add urgency_level field
    // Ensure latitude/longitude are properly formatted
    const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude.toString());
    const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude.toString());

    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());
    formData.append('address', data.address);
    formData.append('notes', ''); // Add notes field (optional)

    // Add photo files if available
    if (data.photoFiles && data.photoFiles.length > 0) {
      data.photoFiles.forEach(file => {
        formData.append('photos', file);
      });
    } else {
      // Create dummy file if no photos (since API requires minimum 1 photo)
      const dummyFile = new Blob(['dummy'], { type: 'text/plain' });
      formData.append('photos', dummyFile, 'dummy.txt');
    }

    console.log('📤 FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return apiClient.post('/spatial-planning', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Generic API service for future use
export const apiService = {
  // Spatial Planning
  submitSpatialPlanning: spatialPlanningApi.submit,

  // Building Management (Future)
  submitBuildingReport: async (data: any): Promise<AxiosResponse<ApiResponse>> => {
    console.log('🏢 Submitting Building Report:', data);
    return apiClient.post('/reports', data);
  },

  // Water Resources (Future)
  submitWaterResources: async (data: any): Promise<AxiosResponse<ApiResponse>> => {
    console.log('💧 Submitting Water Resources Data:', data);
    return apiClient.post('/water-resources', data);
  },
};

export default apiService;