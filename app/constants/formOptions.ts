/**
 * Form Select Options
 * Mapping antara nilai UI (yang ditampilkan ke user) dengan nilai API (yang dikirim ke backend)
 */

import {
  REPORTER_ROLE,
  BUILDING_TYPE,
  REPORT_STATUS,
  FUNDING_SOURCE,
  WORK_TYPE,
  CONDITION_AFTER_REHAB,
  INSTITUTION_UNIT,
  ROAD_TYPE,
  ROAD_CLASS,
  PAVEMENT_TYPE,
  DAMAGE_LEVEL,
  URGENCY_LEVEL,
  BRIDGE_STRUCTURE_TYPE,
  BRIDGE_DAMAGE_TYPE,
  BRIDGE_DAMAGE_LEVEL,
  ROAD_DAMAGE_TYPE,
  TRAFFIC_CONDITION,
  AREA_CATEGORY,
  VIOLATION_TYPE,
  VIOLATION_LEVEL,
  ENVIRONMENTAL_IMPACT,
  URGENCY_CATEGORY,
  IRRIGATION_TYPE,
  WATER_DAMAGE_TYPE,
} from './formEnums';

// ============================================
// SELECT OPTIONS INTERFACE
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  apiValue: string; // Nilai yang akan dikirim ke API
}

// ============================================
// TATA BANGUNAN OPTIONS
// ============================================

export const REPORTER_ROLE_OPTIONS: SelectOption[] = [
  {
    value: 'perangkat-desa',
    label: 'Perangkat Desa',
    apiValue: REPORTER_ROLE.PERANGKAT_DESA,
  },
  {
    value: 'opd-dinas',
    label: 'OPD/Dinas Teknis',
    apiValue: REPORTER_ROLE.OPD_DINAS_TEKNIS,
  },
  {
    value: 'kelompok-masyarakat',
    label: 'Kelompok Masyarakat',
    apiValue: REPORTER_ROLE.KELOMPOK_MASYARAKAT,
  },
  {
    value: 'masyarakat-umum',
    label: 'Masyarakat Umum',
    apiValue: REPORTER_ROLE.MASYARAKAT_UMUM,
  },
];

export const BUILDING_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'kantor-pemerintah',
    label: 'Kantor Pemerintah',
    apiValue: BUILDING_TYPE.KANTOR_PEMERINTAH,
  },
  {
    value: 'sekolah',
    label: 'Sekolah',
    apiValue: BUILDING_TYPE.SEKOLAH,
  },
  {
    value: 'puskesmas-posyandu',
    label: 'Puskesmas/Posyandu',
    apiValue: BUILDING_TYPE.PUSKESMAS_POSYANDU,
  },
  {
    value: 'pasar',
    label: 'Pasar',
    apiValue: BUILDING_TYPE.PASAR,
  },
  {
    value: 'sarana-olahraga',
    label: 'Sarana Olahraga/Gedung Serbaguna',
    apiValue: BUILDING_TYPE.SARANA_OLAHRAGA,
  },
  {
    value: 'fasilitas-umum',
    label: 'Fasilitas Umum Lainnya',
    apiValue: BUILDING_TYPE.FASILITAS_UMUM,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: BUILDING_TYPE.LAINNYA,
  },
];

export const REPORT_STATUS_OPTIONS: SelectOption[] = [
  {
    value: 'rehabilitasi',
    label: 'Rehabilitasi/Perbaikan',
    apiValue: REPORT_STATUS.REHABILITASI,
  },
  {
    value: 'pembangunan-baru',
    label: 'Pembangunan Baru',
    apiValue: REPORT_STATUS.PEMBANGUNAN_BARU,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: REPORT_STATUS.LAINNYA,
  },
];

export const FUNDING_SOURCE_OPTIONS: SelectOption[] = [
  {
    value: 'apbd-kabupaten',
    label: 'APBD Kabupaten',
    apiValue: FUNDING_SOURCE.APBD_KABUPATEN,
  },
  {
    value: 'apbd-provinsi',
    label: 'APBD Provinsi',
    apiValue: FUNDING_SOURCE.APBD_PROVINSI,
  },
  {
    value: 'apbn',
    label: 'APBN',
    apiValue: FUNDING_SOURCE.APBN,
  },
  {
    value: 'dana-desa',
    label: 'Dana Desa',
    apiValue: FUNDING_SOURCE.DANA_DESA,
  },
  {
    value: 'swadaya-masyarakat',
    label: 'Swadaya Masyarakat',
    apiValue: FUNDING_SOURCE.SWADAYA_MASYARAKAT,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: FUNDING_SOURCE.LAINNYA,
  },
];

export const WORK_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'perbaikan-atap',
    label: 'Perbaikan Atap',
    apiValue: WORK_TYPE.PERBAIKAN_ATAP,
  },
  {
    value: 'perbaikan-dinding',
    label: 'Perbaikan Dinding/Cat',
    apiValue: WORK_TYPE.PERBAIKAN_DINDING,
  },
  {
    value: 'perbaikan-lantai',
    label: 'Perbaikan Lantai',
    apiValue: WORK_TYPE.PERBAIKAN_LANTAI,
  },
  {
    value: 'perbaikan-pintu-jendela',
    label: 'Perbaikan Pintu/Jendela',
    apiValue: WORK_TYPE.PERBAIKAN_PINTU_JENDELA,
  },
  {
    value: 'perbaikan-sanitasi',
    label: 'Perbaikan Sanitasi/MCK',
    apiValue: WORK_TYPE.PERBAIKAN_SANITASI,
  },
  {
    value: 'perbaikan-listrik-air',
    label: 'Perbaikan Listrik/Air',
    apiValue: WORK_TYPE.PERBAIKAN_LISTRIK_AIR,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: WORK_TYPE.LAINNYA,
  },
];

export const CONDITION_AFTER_REHAB_OPTIONS: SelectOption[] = [
  {
    value: 'baik-siap-pakai',
    label: 'Baik & Siap Pakai',
    apiValue: CONDITION_AFTER_REHAB.BAIK_SIAP_PAKAI,
  },
  {
    value: 'butuh-perbaikan',
    label: 'Masih Membutuhkan Perbaikan Tambahan',
    apiValue: CONDITION_AFTER_REHAB.BUTUH_PERBAIKAN_TAMBAHAN,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: CONDITION_AFTER_REHAB.LAINNYA,
  },
];

// ============================================
// BINA MARGA OPTIONS
// ============================================

export const INSTITUTION_OPTIONS: SelectOption[] = [
  {
    value: 'dinas',
    label: 'Dinas',
    apiValue: INSTITUTION_UNIT.DINAS,
  },
  {
    value: 'desa',
    label: 'Desa',
    apiValue: INSTITUTION_UNIT.DESA,
  },
  {
    value: 'kecamatan',
    label: 'Kecamatan',
    apiValue: INSTITUTION_UNIT.KECAMATAN,
  },
];

export const ROAD_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'jalan-nasional',
    label: 'Jalan Nasional',
    apiValue: ROAD_TYPE.JALAN_NASIONAL,
  },
  {
    value: 'jalan-provinsi',
    label: 'Jalan Provinsi',
    apiValue: ROAD_TYPE.JALAN_PROVINSI,
  },
  {
    value: 'jalan-kabupaten',
    label: 'Jalan Kabupaten',
    apiValue: ROAD_TYPE.JALAN_KABUPATEN,
  },
  {
    value: 'jalan-desa',
    label: 'Jalan Desa',
    apiValue: ROAD_TYPE.JALAN_DESA,
  },
];

export const ROAD_CLASS_OPTIONS: SelectOption[] = [
  {
    value: 'arteri',
    label: 'Arteri',
    apiValue: ROAD_CLASS.ARTERI,
  },
  {
    value: 'kolektor',
    label: 'Kolektor',
    apiValue: ROAD_CLASS.KOLEKTOR,
  },
  {
    value: 'lokal',
    label: 'Lokal',
    apiValue: ROAD_CLASS.LOKAL,
  },
  {
    value: 'lingkungan',
    label: 'Lingkungan',
    apiValue: ROAD_CLASS.LINGKUNGAN,
  },
];

export const PAVEMENT_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'aspal',
    label: 'Aspal/Flexible Pavement',
    apiValue: PAVEMENT_TYPE.ASPAL_FLEXIBLE,
  },
  {
    value: 'beton',
    label: 'Beton/Rigid Pavement',
    apiValue: PAVEMENT_TYPE.BETON_RIGID,
  },
  {
    value: 'paving',
    label: 'Paving',
    apiValue: PAVEMENT_TYPE.PAVING,
  },
  {
    value: 'jalan-tanah',
    label: 'Jalan Tanah',
    apiValue: PAVEMENT_TYPE.JALAN_TANAH,
  },
];

export const DAMAGE_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'ringan',
    label: 'Ringan (kurang dari 10% area)',
    apiValue: DAMAGE_LEVEL.RINGAN,
  },
  {
    value: 'sedang',
    label: 'Sedang (11-25% area)',
    apiValue: DAMAGE_LEVEL.SEDANG,
  },
  {
    value: 'berat',
    label: 'Berat (Lebih dari 25% area atau jalan putus)',
    apiValue: DAMAGE_LEVEL.BERAT,
  },
];

export const URGENCY_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'darurat',
    label: 'Darurat',
    apiValue: URGENCY_LEVEL.DARURAT,
  },
  {
    value: 'cepat',
    label: 'Cepat',
    apiValue: URGENCY_LEVEL.CEPAT,
  },
  {
    value: 'rutin',
    label: 'Rutin',
    apiValue: URGENCY_LEVEL.RUTIN,
  },
];

export const ROAD_DAMAGE_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'lubang',
    label: 'Lubang (Potholes)',
    apiValue: ROAD_DAMAGE_TYPE.LUBANG_POTHOLES,
  },
  {
    value: 'retak-buaya',
    label: 'Retak Buaya (Aligator Cracking)',
    apiValue: ROAD_DAMAGE_TYPE.RETAK_KULIT_BUAYA,
  },
  {
    value: 'amblas-longsor',
    label: 'Amblas/Longsor',
    apiValue: ROAD_DAMAGE_TYPE.AMBLAS_LONGSOR,
  },
  {
    value: 'permukaan-aus',
    label: 'Permukaan Aus/Raveling',
    apiValue: ROAD_DAMAGE_TYPE.PERMUKAAN_AUS_RAVELING,
  },
  {
    value: 'genangan-air',
    label: 'Genangan Air/Drainase Buruk',
    apiValue: ROAD_DAMAGE_TYPE.GENANGAN_AIR_DRAINASE_BURUK,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: ROAD_DAMAGE_TYPE.LAINNYA,
  },
];

export const TRAFFIC_CONDITION_OPTIONS: SelectOption[] = [
  {
    value: 'masih-bisa-dilalui',
    label: 'Masih Bisa Dilalui',
    apiValue: TRAFFIC_CONDITION.MASIH_BISA_DILALUI,
  },
  {
    value: 'satu-jalur',
    label: 'Hanya Satu Jalur Bisa Dilalui',
    apiValue: TRAFFIC_CONDITION.HANYA_SATU_LAJUR_BISA_DILALUI,
  },
  {
    value: 'tidak-bisa-dilalui',
    label: 'Tidak Bisa Dilalui/Jalan Putus',
    apiValue: TRAFFIC_CONDITION.TIDAK_BISA_DILALUI_PUTUS,
  },
];

export const BRIDGE_STRUCTURE_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'beton-bertulang',
    label: 'Beton Bertulang',
    apiValue: BRIDGE_STRUCTURE_TYPE.BETON_BERTULANG,
  },
  {
    value: 'baja',
    label: 'Baja',
    apiValue: BRIDGE_STRUCTURE_TYPE.BAJA,
  },
  {
    value: 'kayu',
    label: 'Kayu',
    apiValue: BRIDGE_STRUCTURE_TYPE.KAYU,
  },
];

export const BRIDGE_DAMAGE_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'lantai-jembatan-retak',
    label: 'Lantai Jembatan Retak/Rusak',
    apiValue: BRIDGE_DAMAGE_TYPE.LANTAI_JEMBATAN_RETAK_RUSAK,
  },
  {
    value: 'oprit-abutment-amblas',
    label: 'Oprit/Abutment Amblas',
    apiValue: BRIDGE_DAMAGE_TYPE.OPRIT_ABUTMENT_AMBLAS,
  },
  {
    value: 'rangka-utama-retak',
    label: 'Rangka Utama Retak',
    apiValue: BRIDGE_DAMAGE_TYPE.RANGKA_UTAMA_RETAK,
  },
  {
    value: 'pondasi-terseret-arus',
    label: 'Pondasi Terseret Arus',
    apiValue: BRIDGE_DAMAGE_TYPE.PONDASI_TERSERET_ARUS,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: BRIDGE_DAMAGE_TYPE.LAINNYA,
  },
];

export const BRIDGE_DAMAGE_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'ringan',
    label: 'Ringan',
    apiValue: BRIDGE_DAMAGE_LEVEL.RINGAN,
  },
  {
    value: 'sedang',
    label: 'Sedang',
    apiValue: BRIDGE_DAMAGE_LEVEL.SEDANG,
  },
  {
    value: 'berat',
    label: 'Berat/Tidak Layak',
    apiValue: BRIDGE_DAMAGE_LEVEL.BERAT_TIDAK_LAYAK,
  },
];

// ============================================
// TATA RUANG OPTIONS
// ============================================

export const AREA_CATEGORY_OPTIONS: SelectOption[] = [
  {
    value: 'cagar-budaya',
    label: 'Kawasan Cagar Budaya',
    apiValue: AREA_CATEGORY.KAWASAN_CAGAR_BUDAYA,
  },
  {
    value: 'hutan',
    label: 'Kawasan Hutan',
    apiValue: AREA_CATEGORY.KAWASAN_HUTAN,
  },
  {
    value: 'pariwisata',
    label: 'Kawasan Pariwisata',
    apiValue: AREA_CATEGORY.KAWASAN_PARIWISATA,
  },
  {
    value: 'perkebunan',
    label: 'Kawasan Perkebunan',
    apiValue: AREA_CATEGORY.KAWASAN_PERKEBUNAN,
  },
  {
    value: 'permukiman',
    label: 'Kawasan Permukiman',
    apiValue: AREA_CATEGORY.KAWASAN_PERMUKIMAN,
  },
  {
    value: 'pertahanan-keamanan',
    label: 'Kawasan Pertahanan dan Keamanan',
    apiValue: AREA_CATEGORY.KAWASAN_PERTAHANAN_KEAMANAN,
  },
  {
    value: 'peruntukan-industri',
    label: 'Kawasan Peruntukan Industri',
    apiValue: AREA_CATEGORY.KAWASAN_PERUNTUKAN_INDUSTRI,
  },
  {
    value: 'peruntukan-pertambangan',
    label: 'Kawasan Peruntukan Pertambangan Batuan',
    apiValue: AREA_CATEGORY.KAWASAN_PERUNTUKAN_PERTAMBANGAN,
  },
  {
    value: 'tanaman-pangan',
    label: 'Kawasan Tanaman Pangan',
    apiValue: AREA_CATEGORY.KAWASAN_TANAMAN_PANGAN,
  },
  {
    value: 'transportasi',
    label: 'Kawasan Transportasi',
    apiValue: AREA_CATEGORY.KAWASAN_TRANSPORTASI,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: AREA_CATEGORY.LAINNYA,
  },
];

export const VIOLATION_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'bangunan-sempadan-sungai',
    label: 'Bangunan di sempadan sungai/waduk/bendungan',
    apiValue: VIOLATION_TYPE.BANGUNAN_SEMPADAN_SUNGAI,
  },
  {
    value: 'bangunan-sempadan-jalan',
    label: 'Bangunan di sempadan jalan',
    apiValue: VIOLATION_TYPE.BANGUNAN_SEMPADAN_JALAN,
  },
  {
    value: 'alih-fungsi-pertanian',
    label: 'Alih fungsi lahan pertanian',
    apiValue: VIOLATION_TYPE.ALIH_FUNGSI_LAHAN_PERTANIAN,
  },
  {
    value: 'alih-fungsi-rth',
    label: 'Alih fungsi ruang terbuka hijau',
    apiValue: VIOLATION_TYPE.ALIH_FUNGSI_RTH,
  },
  {
    value: 'pembangunan-tanpa-izin',
    label: 'Pembangunan tanpa izin pemanfaatan ruang',
    apiValue: VIOLATION_TYPE.PEMBANGUNAN_TANPA_IZIN,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: VIOLATION_TYPE.LAINNYA,
  },
];

export const VIOLATION_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'ringan',
    label: 'Ringan (dapat diperbaiki cepat, fungsi kawasan masih berjalan)',
    apiValue: VIOLATION_LEVEL.RINGAN,
  },
  {
    value: 'sedang',
    label: 'Sedang (fungsi kawasan terganggu sebagian)',
    apiValue: VIOLATION_LEVEL.SEDANG,
  },
  {
    value: 'berat',
    label: 'Berat (fungsi kawasan hilang / tidak sesuai peruntukan)',
    apiValue: VIOLATION_LEVEL.BERAT,
  },
];

export const ENVIRONMENTAL_IMPACT_OPTIONS: SelectOption[] = [
  {
    value: 'menurun-kualitas',
    label: 'Menurunnya kualitas ruang / ekosistem',
    apiValue: ENVIRONMENTAL_IMPACT.MENURUN_KUALITAS_RUANG,
  },
  {
    value: 'potensi-bencana',
    label: 'Potensi banjir / longsor',
    apiValue: ENVIRONMENTAL_IMPACT.POTENSI_BANJIR_LONGSOR,
  },
  {
    value: 'ganggu-warga',
    label: 'Mengganggu aktivitas warga',
    apiValue: ENVIRONMENTAL_IMPACT.GANGGU_AKTIVITAS_WARGA,
  },
];

export const URGENCY_CATEGORY_OPTIONS: SelectOption[] = [
  {
    value: 'mendesak',
    label: 'Mendesak',
    apiValue: URGENCY_CATEGORY.MENDESAK,
  },
  {
    value: 'biasa',
    label: 'Biasa',
    apiValue: URGENCY_CATEGORY.BIASA,
  },
];

// ============================================
// SUMBER DAYA AIR OPTIONS
// ============================================

export const IRRIGATION_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'saluran-sekunder',
    label: 'Saluran Sekunder',
    apiValue: IRRIGATION_TYPE.SALURAN_SEKUNDER,
  },
  {
    value: 'bendung',
    label: 'Bendung',
    apiValue: IRRIGATION_TYPE.BENDUNG,
  },
  {
    value: 'embung-dam',
    label: 'Embung/Dam',
    apiValue: IRRIGATION_TYPE.EMBUNG_DAM,
  },
  {
    value: 'pintu-air',
    label: 'Pintu Air',
    apiValue: IRRIGATION_TYPE.PINTU_AIR,
  },
];

export const WATER_DAMAGE_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'retak-bocor',
    label: 'Retak/Bocor',
    apiValue: WATER_DAMAGE_TYPE.RETAK_BOCOR,
  },
  {
    value: 'longsor-ambrol',
    label: 'Longsor/Ambrol',
    apiValue: WATER_DAMAGE_TYPE.LONGSOR_AMBROL,
  },
  {
    value: 'sedimentasi',
    label: 'Sedimentasi Tinggi',
    apiValue: WATER_DAMAGE_TYPE.SEDIMENTASI_TINGGI,
  },
  {
    value: 'tersumbat',
    label: 'Tersumbat Sampah',
    apiValue: WATER_DAMAGE_TYPE.TERSUMBAT_SAMPAH,
  },
  {
    value: 'beton-rusak',
    label: 'Struktur Beton Rusak',
    apiValue: WATER_DAMAGE_TYPE.STRUKTUR_BETON_RUSAK,
  },
  {
    value: 'pintu-macet',
    label: 'Pintu Air Macet/Tidak Berfungsi',
    apiValue: WATER_DAMAGE_TYPE.PINTU_AIR_MACET,
  },
  {
    value: 'tanggul-jebol',
    label: 'Tanggul Jebol',
    apiValue: WATER_DAMAGE_TYPE.TANGGUL_JEBOL,
  },
  {
    value: 'lainnya',
    label: 'Lainnya',
    apiValue: WATER_DAMAGE_TYPE.LAINNYA,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get API value from UI value
 */
export function getApiValue(options: SelectOption[], uiValue: string): string {
  const option = options.find((opt) => opt.value === uiValue);
  return option?.apiValue || uiValue;
}

/**
 * Get UI value from API value
 */
export function getUiValue(options: SelectOption[], apiValue: string): string {
  const option = options.find((opt) => opt.apiValue === apiValue);
  return option?.value || apiValue;
}
