/**
 * Form Enums Constants
 * Centralized enum values untuk semua form infrastructure
 * Nilai-nilai ini disesuaikan dengan backend API requirements
 */

// ============================================
// TATA BANGUNAN (Building Report) ENUMS
// ============================================

export const REPORTER_ROLE = {
  PERANGKAT_DESA: 'PERANGKAT_DESA',
  OPD_DINAS_TEKNIS: 'OPD_DINAS_TEKNIS',
  KELOMPOK_MASYARAKAT: 'KELOMPOK_MASYARAKAT',
  MASYARAKAT_UMUM: 'MASYARAKAT_UMUM',
} as const;

export const BUILDING_TYPE = {
  KANTOR_PEMERINTAH: 'KANTOR_PEMERINTAH',
  SEKOLAH: 'SEKOLAH',
  PUSKESMAS_POSYANDU: 'PUSKESMAS_POSYANDU',
  PASAR: 'PASAR',
  SARANA_OLAHRAGA: 'SARANA_OLAHRAGA',
  FASILITAS_UMUM: 'FASILITAS_UMUM',
  LAINNYA: 'LAINNYA',
} as const;

export const REPORT_STATUS = {
  REHABILITASI: 'REHABILITASI',
  PEMBANGUNAN_BARU: 'PEMBANGUNAN_BARU',
  LAINNYA: 'LAINNYA',
} as const;

export const FUNDING_SOURCE = {
  APBD_KABUPATEN: 'APBD_KABUPATEN',
  APBD_PROVINSI: 'APBD_PROVINSI',
  APBN: 'APBN',
  DANA_DESA: 'DANA_DESA',
  SWADAYA_MASYARAKAT: 'SWADAYA_MASYARAKAT',
  LAINNYA: 'LAINNYA',
} as const;

export const WORK_TYPE = {
  PERBAIKAN_ATAP: 'PERBAIKAN_ATAP',
  PERBAIKAN_DINDING: 'PERBAIKAN_DINDING',
  PERBAIKAN_LANTAI: 'PERBAIKAN_LANTAI',
  PERBAIKAN_PINTU_JENDELA: 'PERBAIKAN_PINTU_JENDELA',
  PERBAIKAN_SANITASI: 'PERBAIKAN_SANITASI',
  PERBAIKAN_LISTRIK_AIR: 'PERBAIKAN_LISTRIK_AIR',
  LAINNYA: 'LAINNYA',
} as const;

export const CONDITION_AFTER_REHAB = {
  BAIK_SIAP_PAKAI: 'BAIK_SIAP_PAKAI',
  BUTUH_PERBAIKAN_TAMBAHAN: 'BUTUH_PERBAIKAN_TAMBAHAN',
  LAINNYA: 'LAINNYA',
} as const;

// ============================================
// BINA MARGA (Road Infrastructure) ENUMS
// ============================================

export const INSTITUTION_UNIT = {
  DINAS: 'DINAS',
  DESA: 'DESA',
  KECAMATAN: 'KECAMATAN',
} as const;

export const ROAD_TYPE = {
  JALAN_NASIONAL: 'JALAN_NASIONAL',
  JALAN_PROVINSI: 'JALAN_PROVINSI',
  JALAN_KABUPATEN: 'JALAN_KABUPATEN',
  JALAN_DESA: 'JALAN_DESA',
} as const;

export const ROAD_CLASS = {
  ARTERI: 'ARTERI',
  KOLEKTOR: 'KOLEKTOR',
  LOKAL: 'LOKAL',
  LINGKUNGAN: 'LINGKUNGAN',
} as const;

export const PAVEMENT_TYPE = {
  ASPAL_FLEXIBLE: 'ASPAL_FLEXIBLE',
  BETON_RIGID: 'BETON_RIGID',
  PAVING: 'PAVING',
  JALAN_TANAH: 'JALAN_TANAH',
} as const;

export const DAMAGE_LEVEL = {
  RINGAN: 'RINGAN',
  SEDANG: 'SEDANG',
  BERAT: 'BERAT',
} as const;

export const URGENCY_LEVEL = {
  DARURAT: 'DARURAT',
  CEPAT: 'CEPAT',
  RUTIN: 'RUTIN',
} as const;

// Bridge-specific enums
export const BRIDGE_STRUCTURE_TYPE = {
  BETON_BERTULANG: 'BETON_BERTULANG',
  BAJA: 'BAJA',
  KAYU: 'KAYU',
} as const;

export const BRIDGE_DAMAGE_TYPE = {
  LANTAI_JEMBATAN_RETAK_RUSAK: 'LANTAI_JEMBATAN_RETAK_RUSAK',
  OPRIT_ABUTMENT_AMBLAS: 'OPRIT_ABUTMENT_AMBLAS',
  RANGKA_UTAMA_RETAK: 'RANGKA_UTAMA_RETAK',
  PONDASI_TERSERET_ARUS: 'PONDASI_TERSERET_ARUS',
  LAINNYA: 'LAINNYA',
} as const;

export const BRIDGE_DAMAGE_LEVEL = {
  RINGAN: 'RINGAN',
  SEDANG: 'SEDANG',
  BERAT_TIDAK_LAYAK: 'BERAT_TIDAK_LAYAK',
} as const;

// ============================================
// TATA RUANG (Spatial Planning) ENUMS
// ============================================

export const AREA_CATEGORY = {
  KAWASAN_CAGAR_BUDAYA: 'KAWASAN_CAGAR_BUDAYA',
  KAWASAN_HUTAN: 'KAWASAN_HUTAN',
  KAWASAN_PARIWISATA: 'KAWASAN_PARIWISATA',
  KAWASAN_PERKEBUNAN: 'KAWASAN_PERKEBUNAN',
  KAWASAN_PERMUKIMAN: 'KAWASAN_PERMUKIMAN',
  KAWASAN_PERTAHANAN_KEAMANAN: 'KAWASAN_PERTAHANAN_KEAMANAN',
  KAWASAN_PERUNTUKAN_INDUSTRI: 'KAWASAN_PERUNTUKAN_INDUSTRI',
  KAWASAN_PERUNTUKAN_PERTAMBANGAN: 'KAWASAN_PERUNTUKAN_PERTAMBANGAN',
  KAWASAN_TANAMAN_PANGAN: 'KAWASAN_TANAMAN_PANGAN',
  KAWASAN_TRANSPORTASI: 'KAWASAN_TRANSPORTASI',
  LAINNYA: 'LAINNYA',
} as const;

export const VIOLATION_TYPE = {
  BANGUNAN_SEMPADAN_SUNGAI: 'BANGUNAN_SEMPADAN_SUNGAI',
  BANGUNAN_SEMPADAN_JALAN: 'BANGUNAN_SEMPADAN_JALAN',
  ALIH_FUNGSI_LAHAN_PERTANIAN: 'ALIH_FUNGSI_LAHAN_PERTANIAN',
  ALIH_FUNGSI_RTH: 'ALIH_FUNGSI_RTH',
  PEMBANGUNAN_TANPA_IZIN: 'PEMBANGUNAN_TANPA_IZIN',
  LAINNYA: 'LAINNYA',
} as const;

export const VIOLATION_LEVEL = {
  RINGAN: 'RINGAN',
  SEDANG: 'SEDANG',
  BERAT: 'BERAT',
} as const;

export const ENVIRONMENTAL_IMPACT = {
  MENURUN_KUALITAS_RUANG: 'MENURUN_KUALITAS_RUANG',
  POTENSI_BANJIR_LONGSOR: 'POTENSI_BANJIR_LONGSOR',
  GANGGU_AKTIVITAS_WARGA: 'GANGGU_AKTIVITAS_WARGA',
} as const;

export const URGENCY_CATEGORY = {
  MENDESAK: 'MENDESAK',
  BIASA: 'BIASA',
} as const;

// ============================================
// SUMBER DAYA AIR (Water Resources) ENUMS
// ============================================

export const IRRIGATION_TYPE = {
  SALURAN_SEKUNDER: 'SALURAN_SEKUNDER',
  BENDUNG: 'BENDUNG',
  EMBUNG_DAM: 'EMBUNG_DAM',
  PINTU_AIR: 'PINTU_AIR',
} as const;

export const WATER_DAMAGE_TYPE = {
  RETAK_BOCOR: 'RETAK_BOCOR',
  LONGSOR_AMBROL: 'LONGSOR_AMBROL',
  SEDIMENTASI_TINGGI: 'SEDIMENTASI_TINGGI',
  TERSUMBAT_SAMPAH: 'TERSUMBAT_SAMPAH',
  STRUKTUR_BETON_RUSAK: 'STRUKTUR_BETON_RUSAK',
  PINTU_AIR_MACET: 'PINTU_AIR_MACET',
  TANGGUL_JEBOL: 'TANGGUL_JEBOL',
  LAINNYA: 'LAINNYA',
} as const;

// ============================================
// HELPER TYPES
// ============================================

export type ReporterRole = (typeof REPORTER_ROLE)[keyof typeof REPORTER_ROLE];
export type BuildingType = (typeof BUILDING_TYPE)[keyof typeof BUILDING_TYPE];
export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];
export type FundingSource = (typeof FUNDING_SOURCE)[keyof typeof FUNDING_SOURCE];
export type WorkType = (typeof WORK_TYPE)[keyof typeof WORK_TYPE];
export type ConditionAfterRehab = (typeof CONDITION_AFTER_REHAB)[keyof typeof CONDITION_AFTER_REHAB];

export type InstitutionUnit = (typeof INSTITUTION_UNIT)[keyof typeof INSTITUTION_UNIT];
export type RoadType = (typeof ROAD_TYPE)[keyof typeof ROAD_TYPE];
export type RoadClass = (typeof ROAD_CLASS)[keyof typeof ROAD_CLASS];
export type PavementType = (typeof PAVEMENT_TYPE)[keyof typeof PAVEMENT_TYPE];
export type DamageLevel = (typeof DAMAGE_LEVEL)[keyof typeof DAMAGE_LEVEL];
export type UrgencyLevel = (typeof URGENCY_LEVEL)[keyof typeof URGENCY_LEVEL];

export type BridgeStructureType = (typeof BRIDGE_STRUCTURE_TYPE)[keyof typeof BRIDGE_STRUCTURE_TYPE];
export type BridgeDamageType = (typeof BRIDGE_DAMAGE_TYPE)[keyof typeof BRIDGE_DAMAGE_TYPE];
export type BridgeDamageLevel = (typeof BRIDGE_DAMAGE_LEVEL)[keyof typeof BRIDGE_DAMAGE_LEVEL];

export type AreaCategory = (typeof AREA_CATEGORY)[keyof typeof AREA_CATEGORY];
export type ViolationType = (typeof VIOLATION_TYPE)[keyof typeof VIOLATION_TYPE];
export type ViolationLevel = (typeof VIOLATION_LEVEL)[keyof typeof VIOLATION_LEVEL];
export type EnvironmentalImpact = (typeof ENVIRONMENTAL_IMPACT)[keyof typeof ENVIRONMENTAL_IMPACT];
export type UrgencyCategory = (typeof URGENCY_CATEGORY)[keyof typeof URGENCY_CATEGORY];

export type IrrigationType = (typeof IRRIGATION_TYPE)[keyof typeof IRRIGATION_TYPE];
export type WaterDamageType = (typeof WATER_DAMAGE_TYPE)[keyof typeof WATER_DAMAGE_TYPE];
