import React from 'react';
import Map from './components/Map';
import EarthquakeList from './components/EarthquakeList';
import EarthquakeDetails from './components/EarthquakeDetails';
import AttenuationPanel from './components/AttenuationPanel';
import { Activity } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                EarthquakeBuilder
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <Map />
              </div>
              <EarthquakeDetails />
            </div>
            
            <div className="space-y-6">
              <EarthquakeList />
              <AttenuationPanel />
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;