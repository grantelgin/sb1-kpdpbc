import { format, subDays } from 'date-fns';

const USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0';

interface QueryParams {
  startTime?: string;
  endTime?: string;
  minMagnitude?: number;
}

export const fetchEarthquakes = async ({ startTime, endTime, minMagnitude = 0 }: QueryParams) => {
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime || format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endtime: endTime || format(new Date(), 'yyyy-MM-dd'),
    minmagnitude: minMagnitude.toString()
  });

  const response = await fetch(`${USGS_API_BASE}/query?${params}`);
  if (!response.ok) throw new Error('Failed to fetch earthquakes');
  return response.json();
};

export const fetchEarthquakeDetails = async (id: string) => {
  const response = await fetch(`${USGS_API_BASE}/detail/${id}.geojson`);
  if (!response.ok) throw new Error('Failed to fetch earthquake details');
  const data = await response.json();
  
  // Extract fault data if available
  let faultData = null;
  if (data.properties.products?.shakemap?.[0]?.contents?.['download/rupture.json']) {
    const ruptureUrl = data.properties.products.shakemap[0].contents['download/rupture.json'].url;
    const ruptureResponse = await fetch(ruptureUrl);
    if (ruptureResponse.ok) {
      faultData = await ruptureResponse.json();
    }
  }

  return {
    ...data,
    faultData
  };
};

export interface FaultSegment {
  FaultGroupName: string;
  Segment: string;
  Active: boolean;
  FaultType: string;
  Rake: number;
  Pt1: [number, number, number];
  Pt2: [number, number, number];
  Pt3: [number, number, number];
  Pt4: [number, number, number];
  Notes: string;
}

export const calculateGroundMotion = async (
  earthquake: any,
  attenuationEquations: any[]
) => {
  // This would typically call your backend service
  // For now, we'll generate mock data
  const { coordinates } = earthquake.geometry;
  const [longitude, latitude, depth] = coordinates;
  
  // Generate a grid of points around the epicenter
  const points: any[] = [];
  for (let lat = latitude - 2; lat <= latitude + 2; lat += 0.1) {
    for (let lon = longitude - 2; lon <= longitude + 2; lon += 0.1) {
      points.push({
        latitude: lat,
        longitude: lon,
        pga: Math.random() * 0.5, // Mock PGA values
        pgv: Math.random() * 50,  // Mock PGV values
      });
    }
  }
  
  return points;
};