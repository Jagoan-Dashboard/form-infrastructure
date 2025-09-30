import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { TataRuangForm, TataBangunanForm, SumberDayaAirForm, BinamargaJalanForm, BinamargaJembatanForm } from '~/types/formData';

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

// Building Management (Tata Bangunan) API
export const buildingReportApi = {
  submit: async (data: TataBangunanForm & {
    photoFiles?: File[],
    reporter_name: string,
    reporter_role: string,
    village: string,
    district: string
  }): Promise<AxiosResponse<ApiResponse>> => {

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add required reporter fields (these would need to be collected from somewhere)
    formData.append('reporter_name', data.reporter_name);
    formData.append('reporter_role', data.reporter_role);
    formData.append('village', data.village);
    formData.append('district', data.district);

    // Add building identification fields
    formData.append('building_name', data.building_name);
    formData.append('building_type', data.building_type);
    formData.append('report_status', data.report_status);
    formData.append('funding_source', data.funding_source);
    formData.append('last_year_construction', data.last_year_construction.toString());

    // Add technical data fields
    formData.append('full_address', data.full_address);

    // Ensure latitude/longitude are properly formatted
    const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude.toString());
    const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude.toString());

    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());
    formData.append('floor_area', data.floor_area.toString());

    // Handle floor_count - convert string to number for API
    const floorCount = data.floor_count === 'lainnya' ? 4 : parseInt(data.floor_count);
    formData.append('floor_count', floorCount.toString());

    // Add optional rehabilitation fields
    if (data.work_type) {
      formData.append('work_type', data.work_type);
    }
    if (data.condition_after_rehab) {
      formData.append('condition_after_rehab', data.condition_after_rehab);
    }

    // Add photo files if available
    if (data.photoFiles && data.photoFiles.length > 0) {
      data.photoFiles.forEach(file => {
        formData.append('photos', file);
      });
    }

    console.log('📤 Building Report FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return apiClient.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Water Resources (Sumber Daya Air) API
export const waterResourcesApi = {
  submit: async (data: SumberDayaAirForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add all required fields
    formData.append('reporter_name', data.reporter_name);
    formData.append('institution_unit', data.institution_unit);
    formData.append('phone_number', data.phone_number);
    formData.append('report_datetime', data.report_datetime);
    formData.append('irrigation_area_name', data.irrigation_area_name);
    formData.append('irrigation_type', data.irrigation_type);

    // Ensure latitude/longitude are properly formatted
    const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude.toString());
    const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude.toString());

    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());
    formData.append('damage_type', data.damage_type);
    formData.append('damage_level', data.damage_level.toUpperCase()); // API expects uppercase

    // Add estimated measurements
    formData.append('estimated_length', data.estimated_length.toString());
    formData.append('estimated_width', data.estimated_width.toString());
    formData.append('estimated_volume', data.estimated_volume.toString());

    // Add impact data
    formData.append('affected_rice_field_area', data.affected_rice_field_area.toString());
    formData.append('affected_farmers_count', data.affected_farmers_count.toString());
    formData.append('urgency_category', data.urgency_category.toUpperCase()); // API expects uppercase

    // Add photo files if available
    if (data.photoFiles && data.photoFiles.length > 0) {
      data.photoFiles.forEach(file => {
        formData.append('photos', file);
      });
    }

    console.log('📤 Water Resources FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return apiClient.post('/water-resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Binamarga Jalan (Roads) API
export const binamargaJalanApi = {
  submit: async (data: BinamargaJalanForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add reporter fields
    formData.append('reporter_name', data.reporter_name);
    formData.append('institution_unit', data.institution_unit);
    formData.append('phone_number', data.phone_number);
    formData.append('report_datetime', data.report_datetime);

    // Add road identification fields
    formData.append('road_name', data.road_name);
    formData.append('road_type', data.road_type.toUpperCase());
    formData.append('road_class', data.road_class.toUpperCase());
    formData.append('segment_length', data.segment_length.toString());

    // Add coordinates
    const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude.toString());
    const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude.toString());
    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());

    // Add damage details
    formData.append('pavement_type', data.pavement_type.toUpperCase());
    formData.append('damage_type', data.damage_type);
    formData.append('damage_level', data.damage_level.toUpperCase());
    formData.append('damaged_length', data.damaged_length.toString());
    formData.append('damaged_width', data.damaged_width.toString());
    formData.append('total_damaged_area', data.total_damaged_area.toString());

    // Add traffic impact
    formData.append('traffic_condition', data.traffic_condition);
    if (data.traffic_impact) {
      formData.append('traffic_impact', data.traffic_impact);
    }
    formData.append('daily_traffic_volume', data.daily_traffic_volume.toString());
    formData.append('urgency_level', data.urgency_level.toUpperCase());

    // Add optional fields
    if (data.cause_of_damage) {
      formData.append('cause_of_damage', data.cause_of_damage);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }

    // Add photo files
    if (data.photoFiles && data.photoFiles.length > 0) {
      data.photoFiles.forEach(file => {
        formData.append('photos', file);
      });
    }

    console.log('📤 Binamarga Jalan FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return apiClient.post('/bina-marga', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Binamarga Jembatan (Bridges) API
export const binamargaJembatanApi = {
  submit: async (data: BinamargaJembatanForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add reporter fields
    formData.append('reporter_name', data.reporter_name);
    formData.append('institution_unit', data.institution_unit);
    formData.append('phone_number', data.phone_number);
    formData.append('report_datetime', data.report_datetime);

    // Add bridge identification fields
    formData.append('bridge_name', data.bridge_name);
    formData.append('bridge_structure_type', data.bridge_structure_type);

    // Add coordinates
    const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude.toString());
    const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude.toString());
    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());

    // Add damage details
    formData.append('bridge_damage_type', data.bridge_damage_type);
    formData.append('bridge_damage_level', data.bridge_damage_level);

    // Add traffic impact
    formData.append('traffic_condition', data.traffic_condition);
    if (data.traffic_impact) {
      formData.append('traffic_impact', data.traffic_impact);
    }
    formData.append('daily_traffic_volume', data.daily_traffic_volume.toString());
    formData.append('urgency_level', data.urgency_level.toUpperCase());

    // Add optional fields
    if (data.cause_of_damage) {
      formData.append('cause_of_damage', data.cause_of_damage);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }

    // Add photo files
    if (data.photoFiles && data.photoFiles.length > 0) {
      data.photoFiles.forEach(file => {
        formData.append('photos', file);
      });
    }

    console.log('📤 Binamarga Jembatan FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return apiClient.post('/bina-marga', formData, {
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

  // Building Management
  submitBuildingReport: buildingReportApi.submit,

  // Water Resources
  submitWaterResources: waterResourcesApi.submit,

  // Binamarga
  submitBinamargaJalan: binamargaJalanApi.submit,
  submitBinamargaJembatan: binamargaJembatanApi.submit,
};

export default apiService;