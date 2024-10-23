export interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    felt: number;
    cdi: number;
    mmi: number;
    alert: string;
    status: string;
    tsunami: number;
    sig: number;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
}

export interface AttenuationEquation {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface GroundMotionData {
  latitude: number;
  longitude: number;
  pga: number;
  pgv: number;
}