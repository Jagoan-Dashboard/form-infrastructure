import type { AxiosResponse } from 'axios';
import type { TataRuangForm, TataBangunanForm, SumberDayaAirForm, BinamargaJalanForm, BinamargaJembatanForm } from '~/types/formData';
import apiClient from '~/lib/api-client';
import {
  appendReporterFields,
  appendLocationFields,
  appendPhotoFiles,
  appendOptionalField,
  appendTrafficFields,
  appendDamageOptionalFields,
} from '~/utils/formDataHelper';
import { FLOOR_COUNT_MAPPING } from '~/constants/apiConstants';

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

if (import.meta.env.DEV) {
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const spatialPlanningApi = {
  submit: async (data: TataRuangForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {
    const formData = new FormData();

    appendReporterFields(formData, {
      reporter_name: data.reporter_name,
      institution: data.institution,
      phone_number: data.phone_number,
      report_datetime: data.report_datetime,
    });

    formData.append('area_description', data.area_description);
    formData.append('area_category', data.area_category);
    formData.append('violation_type', data.violation_type);
    formData.append('violation_level', data.violation_level);
    formData.append('environmental_impact', data.environmental_impact);
    formData.append('urgency_level', data.urgency_level);

    appendLocationFields(formData, data.latitude, data.longitude);
    formData.append('address', data.address);
    formData.append('notes', '');
    appendPhotoFiles(formData, data.photoFiles, true);

    return apiClient.post('/spatial-planning', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const buildingReportApi = {
  submit: async (data: TataBangunanForm & {
    photoFiles?: File[],
    reporter_name: string,
    reporter_role: string,
    village: string,
    district: string
  }): Promise<AxiosResponse<ApiResponse>> => {
    const formData = new FormData();

    formData.append('reporter_name', data.reporter_name);
    formData.append('reporter_role', data.reporter_role);
    formData.append('village', data.village);
    formData.append('district', data.district);
    formData.append('building_name', data.building_name);
    formData.append('building_type', data.building_type);
    formData.append('report_status', data.report_status);
    formData.append('funding_source', data.funding_source);
    formData.append('last_year_construction', data.last_year_construction.toString());

    formData.append('full_address', data.full_address);
    appendLocationFields(formData, data.latitude, data.longitude);

    formData.append('floor_area', data.floor_area.toString());

    const floorCount = data.floor_count === 'lainnya'
      ? FLOOR_COUNT_MAPPING.lainnya
      : parseInt(data.floor_count);
    formData.append('floor_count', floorCount.toString());
    appendOptionalField(formData, 'work_type', data.work_type);
    appendOptionalField(formData, 'condition_after_rehab', data.condition_after_rehab);

    appendPhotoFiles(formData, data.photoFiles);

    return apiClient.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const waterResourcesApi = {
  submit: async (data: SumberDayaAirForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {
    const formData = new FormData();
    appendReporterFields(formData, {
      reporter_name: data.reporter_name,
      institution_unit: data.institution_unit,
      phone_number: data.phone_number,
      report_datetime: data.report_datetime,
    });

    formData.append('irrigation_area_name', data.irrigation_area_name);
    formData.append('irrigation_type', data.irrigation_type);

    appendLocationFields(formData, data.latitude, data.longitude);
    formData.append('damage_type', data.damage_type);
    formData.append('damage_level', data.damage_level.toUpperCase());
    formData.append('estimated_length', data.estimated_length.toString());
    formData.append('estimated_width', data.estimated_width.toString());
    formData.append('estimated_depth', data.estimated_depth.toString());
    formData.append('estimated_area', data.estimated_area.toString());
    formData.append('estimated_volume', data.estimated_volume.toString());

    formData.append('affected_rice_field_area', data.affected_rice_field_area.toString());
    formData.append('affected_farmers_count', data.affected_farmers_count.toString());
    formData.append('urgency_category', data.urgency_category.toUpperCase());

    appendPhotoFiles(formData, data.photoFiles);

    return apiClient.post('/water-resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const binamargaJalanApi = {
  submit: async (data: BinamargaJalanForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {
    const formData = new FormData();
    appendReporterFields(formData, {
      reporter_name: data.reporter_name,
      institution_unit: data.institution_unit,
      phone_number: data.phone_number,
      report_datetime: data.report_datetime,
    });

    formData.append('district', data.district);
    formData.append('road_name', data.road_name);
    formData.append('segment_length', data.segment_length.toString());

    appendLocationFields(formData, data.latitude, data.longitude);

    formData.append('pavement_type', data.pavement_type.toUpperCase());
    formData.append('damage_type', data.damage_type);
    formData.append('damage_level', data.damage_level.toUpperCase());
    formData.append('damaged_length', data.damaged_length.toString());
    formData.append('damaged_width', data.damaged_width.toString());
    formData.append('total_damaged_area', data.total_damaged_area.toString());

    appendTrafficFields(formData, {
      traffic_condition: data.traffic_condition,
      traffic_impact: data.traffic_impact,
      daily_traffic_volume: data.daily_traffic_volume,
      urgency_level: data.urgency_level,
    });

    appendDamageOptionalFields(formData, data.cause_of_damage, data.notes);

    appendPhotoFiles(formData, data.photoFiles);

    return apiClient.post('/bina-marga', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const binamargaJembatanApi = {
  submit: async (data: BinamargaJembatanForm & { photoFiles?: File[] }): Promise<AxiosResponse<ApiResponse>> => {
    const formData = new FormData();
    appendReporterFields(formData, {
      reporter_name: data.reporter_name,
      institution_unit: data.institution_unit,
      phone_number: data.phone_number,
      report_datetime: data.report_datetime,
    });

    formData.append('district', data.district);
    formData.append('road_name', "...");
    formData.append('bridge_name', data.bridge_name);
    formData.append('bridge_section', data.bridge_section);
    formData.append('bridge_structure_type', data.bridge_structure_type);

    appendLocationFields(formData, data.latitude, data.longitude);

    formData.append('bridge_damage_type', data.bridge_damage_type);
    formData.append('bridge_damage_level', data.bridge_damage_level);
    appendTrafficFields(formData, {
      traffic_condition: data.traffic_condition,
      traffic_impact: data.traffic_impact,
      daily_traffic_volume: data.daily_traffic_volume,
      urgency_level: data.urgency_level,
    });

    appendDamageOptionalFields(formData, data.cause_of_damage, data.notes);

    appendPhotoFiles(formData, data.photoFiles);

    return apiClient.post('/bina-marga', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const apiService = {
  submitSpatialPlanning: spatialPlanningApi.submit,
  submitBuildingReport: buildingReportApi.submit,
  submitWaterResources: waterResourcesApi.submit,
  submitBinamargaJalan: binamargaJalanApi.submit,
  submitBinamargaJembatan: binamargaJembatanApi.submit,
};

export default apiService;
