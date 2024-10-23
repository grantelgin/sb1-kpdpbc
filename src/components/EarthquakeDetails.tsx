import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { fetchEarthquakeDetails } from '../services/api';
import { useEarthquakeStore } from '../store/earthquakeStore';
import { format } from 'date-fns';

export default function EarthquakeDetails() {
  const selectedEarthquake = useEarthquakeStore((state) => state.selectedEarthquake);

  const { data: details, isLoading } = useQuery({
    queryKey: ['earthquakeDetails', selectedEarthquake?.id],
    queryFn: () => selectedEarthquake ? fetchEarthquakeDetails(selectedEarthquake.id) : null,
    enabled: !!selectedEarthquake,
  });

  if (!selectedEarthquake) return null;
  if (isLoading) return <div className="p-4">Loading details...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Info className="w-5 h-5" />
          Earthquake Details
        </h2>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Event ID</h3>
            <p className="mt-1">{selectedEarthquake.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1">{selectedEarthquake.properties.place}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Depth</h3>
            <p className="mt-1">{selectedEarthquake.geometry.coordinates[2]} km</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Magnitude</h3>
            <p className="mt-1">{selectedEarthquake.properties.mag}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Time</h3>
            <p className="mt-1">
              {format(new Date(selectedEarthquake.properties.time), 'PPpp')}
            </p>
          </div>
        </div>

        {details?.faultData && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Fault Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rake</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {details.faultData.features?.map((feature: any, index: number) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm">{feature.properties?.group || '-'}</td>
                      <td className="px-3 py-2 text-sm">{feature.properties?.type || '-'}</td>
                      <td className="px-3 py-2 text-sm">{feature.properties?.rake || '-'}</td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feature.properties?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.properties?.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}