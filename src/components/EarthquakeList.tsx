import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Calendar, Search } from 'lucide-react';
import { fetchEarthquakes } from '../services/api';
import { useEarthquakeStore } from '../store/earthquakeStore';
import { formatDistanceToNow } from 'date-fns';

export default function EarthquakeList() {
  const [minMagnitude, setMinMagnitude] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['earthquakes', minMagnitude, startDate, endDate],
    queryFn: () => fetchEarthquakes({
      startTime: startDate,
      endTime: endDate,
      minMagnitude
    }),
    refetchInterval: 60000, // Refetch every minute
  });

  const setSelectedEarthquake = useEarthquakeStore(
    (state) => state.setSelectedEarthquake
  );

  if (isLoading) return <div className="p-4">Loading earthquakes...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading earthquakes</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5" />
          Recent Earthquakes
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="number"
              min="0"
              step="0.1"
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(parseFloat(e.target.value) || 0)}
              placeholder="Min magnitude"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {data?.features?.map((earthquake: any) => (
          <button
            key={earthquake.id}
            className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedEarthquake(earthquake)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{earthquake.properties.place}</h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(earthquake.properties.time), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                M{earthquake.properties.mag}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}