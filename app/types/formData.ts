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
export interface TataRuangForm {
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
type SumberDayaAirForm = {
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


