import { useState } from 'react';
import { useEarthquakeStore } from '../store/earthquakeStore';
import { calculateGroundMotion } from '../services/api';
import { SlidersHorizontal } from 'lucide-react';

const AVAILABLE_EQUATIONS = [
  { id: 'ba08', name: 'Boore & Atkinson (2008)', description: 'Valid for crustal earthquakes in active tectonic regions' },
  { id: 'cb14', name: 'Campbell & Bozorgnia (2014)', description: 'Incorporates hanging wall effects and basin response' },
  { id: 'cy14', name: 'Chiou & Youngs (2014)', description: 'Includes directivity effects and complex site response' },
];

export default function AttenuationPanel() {
  const [loading, setLoading] = useState(false);
  const {
    selectedEarthquake,
    attenuationEquations,
    addAttenuationEquation,
    updateEquationWeight,
    removeAttenuationEquation,
    setGroundMotionData,
  } = useEarthquakeStore();

  const handleAddEquation = (equation: any) => {
    addAttenuationEquation({
      ...equation,
      weight: attenuationEquations.length === 0 ? 1 : 0.5,
    });
  };

  const handleCalculate = async () => {
    if (!selectedEarthquake) return;
    
    setLoading(true);
    try {
      const groundMotion = await calculateGroundMotion(
        selectedEarthquake,
        attenuationEquations
      );
      setGroundMotionData(groundMotion);
    } catch (error) {
      console.error('Failed to calculate ground motion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Ground Motion Models
        </h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {attenuationEquations.map((eq) => (
            <div key={eq.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{eq.name}</span>
                <button
                  onClick={() => removeAttenuationEquation(eq.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={eq.weight}
                onChange={(e) =>
                  updateEquationWeight(eq.id, parseFloat(e.target.value))
                }
                className="w-full"
              />
              <div className="text-sm text-gray-500">
                Weight: {eq.weight.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const equation = AVAILABLE_EQUATIONS.find(
                (eq) => eq.id === e.target.value
              );
              if (equation) handleAddEquation(equation);
            }}
            value=""
          >
            <option value="" disabled>
              Add attenuation equation...
            </option>
            {AVAILABLE_EQUATIONS.filter(
              (eq) => !attenuationEquations.some((added) => added.id === eq.id)
            ).map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!selectedEarthquake || attenuationEquations.length === 0 || loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Calculating...' : 'Calculate Ground Motion'}
        </button>
      </div>
    </div>
  );
}