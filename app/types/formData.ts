// endpoind POST /api/v1/reports
export interface TataBangunanForm {
    reporter_name: string;
    reporter_role: string;
    village: string;
    district: string;
    building_name: string;
    building_type: string;
    report_status: string;
    funding_source: string;
    last_year_construction: number;
    full_address: string;
    latitude: number;
    longitude: number;
    floor_area: number;
    floor_count: string;
    work_type: string;
    condition_after_rehab: string;
    photos: string[];
};

// endpoint POST /api/v1/spatial-planning
export interface TataRuang {
    reporter_name: string;
    institution: string;
    phone_number: string;
    report_datetime: string; // Format: "YYYY-MM-DDTHH:mm:ssZ"
    area_description: string;
    area_category: string;
    violation_type: string;
    violation_level: string;
    environmental_impact: string;
    latitude: number;
    longitude: number;
    address: string;
    photos: string[];
};

// endpoint POST /api/v1/water-resources
export interface SumberDayaAirForm {
    reporter_name: string;
    institution_unit: string;
    phone_number: string;
    report_datetime: string;
    irrigation_area_name: string;
    irrigation_type: string;
    latitude: number;
    longitude: number;
    damage_type: string;
    damage_level: string;
    estimated_length: number;
    estimated_width: number;
    estimated_volume: number;
    affected_rice_field_area: number;
    affected_farmers_count: number;
    urgency_category: string;
    photos: string[];
};

// endpoint POST /api/v1/bina-marga
export interface BinamargaJalanForm {
    // Reporter info
    reporter_name: string;
    institution_unit: string;
    phone_number: string;
    report_datetime: string;

    // Road identification
    road_name: string;
    road_type: string; // JALAN_NASIONAL, JALAN_PROVINSI, JALAN_KABUPATEN, JALAN_DESA
    road_class: string; // ARTERI, KOLEKTOR, LOKAL, LINGKUNGAN
    segment_length: number;
    latitude: number;
    longitude: number;

    // Damage details
    pavement_type: string; // ASPAL_FLEXIBLE, BETON_RIGID, PAVING, JALAN_TANAH
    damage_type: string;
    damage_level: string; // RINGAN, SEDANG, BERAT
    damaged_length: number;
    damaged_width: number;
    total_damaged_area: number;

    // Traffic impact
    traffic_condition: string;
    traffic_impact?: string;
    daily_traffic_volume: number;
    urgency_level: string; // DARURAT, CEPAT, RUTIN

    // Additional info
    cause_of_damage?: string;
    notes?: string;
    photos: string[];
};

// endpoint POST /api/v1/bina-marga
export interface BinamargaJembatanForm {
    // Reporter info
    reporter_name: string;
    institution_unit: string;
    phone_number: string;
    report_datetime: string;

    // Bridge identification
    bridge_name: string;
    bridge_structure_type: string;
    latitude: number;
    longitude: number;

    // Damage details
    bridge_damage_type: string;
    bridge_damage_level: string;

    // Traffic impact
    traffic_condition: string;
    traffic_impact?: string;
    daily_traffic_volume: number;
    urgency_level: string; // DARURAT, CEPAT, RUTIN

    // Additional info
    cause_of_damage?: string;
    notes?: string;
    photos: string[];
};


