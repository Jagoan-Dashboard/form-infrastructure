/**
 * Enum Mapper Utilities
 * Helper functions untuk mapping antara UI values dan API values
 */

import {
  BUILDING_TYPE_OPTIONS,
  REPORT_STATUS_OPTIONS,
  FUNDING_SOURCE_OPTIONS,
  WORK_TYPE_OPTIONS,
  CONDITION_AFTER_REHAB_OPTIONS,
  ROAD_TYPE_OPTIONS,
  ROAD_CLASS_OPTIONS,
  PAVEMENT_TYPE_OPTIONS,
  DAMAGE_LEVEL_OPTIONS,
  URGENCY_LEVEL_OPTIONS,
  ROAD_DAMAGE_TYPE_OPTIONS,
  TRAFFIC_CONDITION_OPTIONS,
  BRIDGE_STRUCTURE_TYPE_OPTIONS,
  BRIDGE_DAMAGE_TYPE_OPTIONS,
  BRIDGE_DAMAGE_LEVEL_OPTIONS,
  AREA_CATEGORY_OPTIONS,
  VIOLATION_TYPE_OPTIONS,
  VIOLATION_LEVEL_OPTIONS,
  ENVIRONMENTAL_IMPACT_OPTIONS,
  URGENCY_CATEGORY_OPTIONS,
  IRRIGATION_TYPE_OPTIONS,
  WATER_DAMAGE_TYPE_OPTIONS,
  INSTITUTION_OPTIONS,
  getApiValue,
} from '~/constants/formOptions';

// ============================================
// TATA BANGUNAN MAPPERS
// ============================================

export const buildingTypeToApi = (uiValue: string): string => {
  return getApiValue(BUILDING_TYPE_OPTIONS, uiValue);
};

export const reportStatusToApi = (uiValue: string): string => {
  return getApiValue(REPORT_STATUS_OPTIONS, uiValue);
};

export const fundingSourceToApi = (uiValue: string): string => {
  return getApiValue(FUNDING_SOURCE_OPTIONS, uiValue);
};

export const workTypeToApi = (uiValue: string): string => {
  return getApiValue(WORK_TYPE_OPTIONS, uiValue);
};

export const conditionAfterRehabToApi = (uiValue: string): string => {
  return getApiValue(CONDITION_AFTER_REHAB_OPTIONS, uiValue);
};

// ============================================
// BINA MARGA MAPPERS
// ============================================

export const institutionToApi = (uiValue: string): string => {
  return getApiValue(INSTITUTION_OPTIONS, uiValue);
};

export const roadTypeToApi = (uiValue: string): string => {
  return getApiValue(ROAD_TYPE_OPTIONS, uiValue);
};

export const roadClassToApi = (uiValue: string): string => {
  return getApiValue(ROAD_CLASS_OPTIONS, uiValue);
};

export const pavementTypeToApi = (uiValue: string): string => {
  return getApiValue(PAVEMENT_TYPE_OPTIONS, uiValue);
};

export const damageLevelToApi = (uiValue: string): string => {
  return getApiValue(DAMAGE_LEVEL_OPTIONS, uiValue);
};

export const urgencyLevelToApi = (uiValue: string): string => {
  return getApiValue(URGENCY_LEVEL_OPTIONS, uiValue);
};

export const roadDamageTypeToApi = (uiValue: string): string => {
  return getApiValue(ROAD_DAMAGE_TYPE_OPTIONS, uiValue);
};

export const trafficConditionToApi = (uiValue: string): string => {
  return getApiValue(TRAFFIC_CONDITION_OPTIONS, uiValue);
};

export const bridgeStructureTypeToApi = (uiValue: string): string => {
  return getApiValue(BRIDGE_STRUCTURE_TYPE_OPTIONS, uiValue);
};

export const bridgeDamageTypeToApi = (uiValue: string): string => {
  return getApiValue(BRIDGE_DAMAGE_TYPE_OPTIONS, uiValue);
};

export const bridgeDamageLevelToApi = (uiValue: string): string => {
  return getApiValue(BRIDGE_DAMAGE_LEVEL_OPTIONS, uiValue);
};

// ============================================
// TATA RUANG MAPPERS
// ============================================

export const areaCategoryToApi = (uiValue: string): string => {
  return getApiValue(AREA_CATEGORY_OPTIONS, uiValue);
};

export const violationTypeToApi = (uiValue: string): string => {
  return getApiValue(VIOLATION_TYPE_OPTIONS, uiValue);
};

export const violationLevelToApi = (uiValue: string): string => {
  return getApiValue(VIOLATION_LEVEL_OPTIONS, uiValue);
};

export const environmentalImpactToApi = (uiValue: string): string => {
  return getApiValue(ENVIRONMENTAL_IMPACT_OPTIONS, uiValue);
};

export const urgencyCategoryToApi = (uiValue: string): string => {
  return getApiValue(URGENCY_CATEGORY_OPTIONS, uiValue);
};

// ============================================
// SUMBER DAYA AIR MAPPERS
// ============================================

export const irrigationTypeToApi = (uiValue: string): string => {
  return getApiValue(IRRIGATION_TYPE_OPTIONS, uiValue);
};

export const waterDamageTypeToApi = (uiValue: string): string => {
  return getApiValue(WATER_DAMAGE_TYPE_OPTIONS, uiValue);
};

// ============================================
// SPECIAL MAPPERS
// ============================================

/**
 * Map peran pelapor from index form to institution unit for API
 * Mapping berdasarkan nilai actual di IndexView.tsx
 */
export const peranPelaporToInstitution = (peran: string): string => {
  const mapping: Record<string, string> = {
    'Perangkat Desa': 'DESA',           // Perangkat Desa → DESA
    'Dinas': 'DINAS',                   // OPD / Dinas Terkait → DINAS
    'Kelompok Masyarakat': 'KECAMATAN', // Kelompok Masyarakat → KECAMATAN
    'Masyarakan Umum': 'DESA',          // Masyarakat Umum → DESA (default)
  };
  return mapping[peran] || 'DESA';
};

/**
 * Generic mapper untuk mengubah kebab-case atau lowercase ke SCREAMING_SNAKE_CASE
 * Contoh: "ringan" → "RINGAN", "jalan-nasional" → "JALAN_NASIONAL"
 */
export const toApiFormat = (value: string): string => {
  return value.toUpperCase().replace(/-/g, '_');
};
