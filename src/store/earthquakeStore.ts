import { create } from 'zustand';
import { AttenuationEquation, Earthquake, GroundMotionData } from '../types/earthquake';

interface EarthquakeState {
  selectedEarthquake: Earthquake | null;
  attenuationEquations: AttenuationEquation[];
  groundMotionData: GroundMotionData[];
  setSelectedEarthquake: (earthquake: Earthquake | null) => void;
  addAttenuationEquation: (equation: AttenuationEquation) => void;
  updateEquationWeight: (id: string, weight: number) => void;
  removeAttenuationEquation: (id: string) => void;
  setGroundMotionData: (data: GroundMotionData[]) => void;
}

export const useEarthquakeStore = create<EarthquakeState>((set) => ({
  selectedEarthquake: null,
  attenuationEquations: [],
  groundMotionData: [],
  
  setSelectedEarthquake: (earthquake) => set({ selectedEarthquake: earthquake }),
  
  addAttenuationEquation: (equation) =>
    set((state) => ({
      attenuationEquations: [...state.attenuationEquations, equation],
    })),
    
  updateEquationWeight: (id, weight) =>
    set((state) => ({
      attenuationEquations: state.attenuationEquations.map((eq) =>
        eq.id === id ? { ...eq, weight } : eq
      ),
    })),
    
  removeAttenuationEquation: (id) =>
    set((state) => ({
      attenuationEquations: state.attenuationEquations.filter((eq) => eq.id !== id),
    })),
    
  setGroundMotionData: (data) => set({ groundMotionData: data }),
}));