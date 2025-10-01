/**
 * Utility functions untuk mapping data ke FormData
 * Mengurangi code duplication di apiService
 */

/**
 * Append common reporter fields ke FormData
 */
export const appendReporterFields = (
  formData: FormData,
  data: {
    reporter_name: string;
    institution_unit?: string;
    institution?: string;
    phone_number: string;
    report_datetime: string;
  }
) => {
  formData.append('reporter_name', data.reporter_name);

  if (data.institution_unit) {
    formData.append('institution_unit', data.institution_unit);
  }

  if (data.institution) {
    formData.append('institution', data.institution);
  }

  formData.append('phone_number', data.phone_number);
  formData.append('report_datetime', data.report_datetime);
};

/**
 * Append location fields (latitude, longitude) ke FormData
 */
export const appendLocationFields = (
  formData: FormData,
  latitude: number,
  longitude: number
) => {
  formData.append('latitude', latitude.toString());
  formData.append('longitude', longitude.toString());
};

/**
 * Append photo files ke FormData
 * Jika tidak ada photo, append dummy file (untuk backward compatibility)
 */
export const appendPhotoFiles = (
  formData: FormData,
  photoFiles?: File[],
  useDummyIfEmpty: boolean = false
) => {
  if (photoFiles && photoFiles.length > 0) {
    photoFiles.forEach(file => {
      formData.append('photos', file);
    });
  } else if (useDummyIfEmpty) {
    const dummyFile = new Blob(['dummy'], { type: 'text/plain' });
    formData.append('photos', dummyFile, 'dummy.txt');
  }
};

/**
 * Append optional fields (hanya append jika value ada)
 */
export const appendOptionalField = (
  formData: FormData,
  key: string,
  value: string | undefined
) => {
  if (value) {
    formData.append(key, value);
  }
};

/**
 * Append traffic-related fields (digunakan untuk Bina Marga)
 */
export const appendTrafficFields = (
  formData: FormData,
  data: {
    traffic_condition: string;
    traffic_impact?: string;
    daily_traffic_volume: number;
    urgency_level: string;
  }
) => {
  formData.append('traffic_condition', data.traffic_condition);

  if (data.traffic_impact) {
    formData.append('traffic_impact', data.traffic_impact);
  }

  formData.append('daily_traffic_volume', data.daily_traffic_volume.toString());
  formData.append('urgency_level', data.urgency_level.toUpperCase());
};

/**
 * Append damage-related optional fields
 */
export const appendDamageOptionalFields = (
  formData: FormData,
  cause_of_damage?: string,
  notes?: string
) => {
  appendOptionalField(formData, 'cause_of_damage', cause_of_damage);
  appendOptionalField(formData, 'notes', notes);
};
