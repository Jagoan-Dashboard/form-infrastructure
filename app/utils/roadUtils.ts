import roadData from '~/../public/json/road_name.json';

export interface Road {
  district: string;
  name: string;
}

export const getDistricts = (): string[] => {
  const districts = new Set<string>();
  roadData.forEach((road: Road) => {
    districts.add(road.district);
  });
  return Array.from(districts).sort();
};

export const getRoadsByDistrict = (district: string): string[] => {
  return roadData
    .filter((road: Road) => road.district === district)
    .map(road => road.name)
    .sort();
};

export const searchRoads = (query: string, district?: string): string[] => {
  const filtered = roadData.filter((road: Road) => {
    const matchesQuery = road.name.toLowerCase().includes(query.toLowerCase());
    const matchesDistrict = district ? road.district === district : true;
    return matchesQuery && matchesDistrict;
  });
  
  return Array.from(new Set(filtered.map(road => road.name))).sort();
};
