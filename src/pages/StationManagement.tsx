
import { useState, useEffect } from 'react';
import { stations as initialStations, bikes } from '@/data/mockData';
import { Station } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Bike } from 'lucide-react';

const StationManagement = () => {
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<Station[]>(stations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Filter stations based on search
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = stations.filter(station => 
        station.name.toLowerCase().includes(term) || 
        station.location.toLowerCase().includes(term)
      );
      setFilteredStations(filtered);
    } else {
      setFilteredStations(stations);
    }
  }, [stations, searchTerm]);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const getBikesAtStation = (stationId: string) => {
    return bikes.filter(bike => bike.stationId === stationId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-graydark">Station Management</h1>
        <p className="text-muted-foreground">View and manage bike stations across the city</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-5 animate-fade-in">
          <div className="mb-4">
            <label htmlFor="search" className="sr-only">Search stations</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 text-graydark"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px] pr-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              All Stations ({filteredStations.length})
            </h3>
            <ul className="space-y-2">
              {filteredStations.map((station) => (
                <li key={station.id}>
                  <button
                    onClick={() => handleStationSelect(station)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors
                      ${selectedStation?.id === station.id 
                        ? 'bg-greenprimary text-white' 
                        : 'hover:bg-graylight text-graydark'}`}
                  >
                    <div className="font-medium">{station.name}</div>
                    <div className="text-sm mt-1 flex justify-between">
                      <span>{station.location}</span>
                      <span>
                        {station.availableBikes}/{station.capacity} bikes
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Station Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 animate-fade-in">
          {selectedStation ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-graydark">{selectedStation.name}</h2>
                <p className="text-gray-500">{selectedStation.location}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-graylight rounded-lg p-4">
                  <div className="text-sm text-gray-500">Capacity</div>
                  <div className="text-2xl font-bold text-graydark">{selectedStation.capacity}</div>
                </div>
                <div className="bg-graylight rounded-lg p-4">
                  <div className="text-sm text-gray-500">Available Bikes</div>
                  <div className="text-2xl font-bold text-graydark">{selectedStation.availableBikes}</div>
                </div>
                <div className="bg-graylight rounded-lg p-4">
                  <div className="text-sm text-gray-500">Utilization</div>
                  <div className="text-2xl font-bold text-graydark">
                    {Math.round((selectedStation.availableBikes / selectedStation.capacity) * 100)}%
                  </div>
                </div>
              </div>

              {/* Station Map Placeholder */}
              <div className="bg-graylight rounded-lg h-48 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto text-greenprimary mb-2" />
                  <p className="text-graydark">
                    Location: {selectedStation.coordinates.lat.toFixed(4)}, {selectedStation.coordinates.lng.toFixed(4)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Map view would display here</p>
                </div>
              </div>

              {/* Bikes at Station */}
              <h3 className="text-lg font-medium text-graydark mb-3">Bikes at this Station</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                        Bike ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                        Battery
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getBikesAtStation(selectedStation.id).map((bike) => (
                      <tr key={bike.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-graydark">
                          {bike.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-graydark">
                          {bike.model}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-graydark">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${bike.status === 'available' ? 'bg-greenprimary/20 text-greenprimary' : 
                              bike.status === 'in-use' ? 'bg-greenaccent/30 text-graydark' : 
                              'bg-error/20 text-error'}`}
                          >
                            {bike.status.charAt(0).toUpperCase() + bike.status.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-graydark">
                          {bike.batteryPercentage ? `${bike.batteryPercentage}%` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {getBikesAtStation(selectedStation.id).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                          No bikes currently at this station
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <MapPin size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-graydark mb-2">No Station Selected</h3>
              <p className="text-gray-500 text-center max-w-md">
                Select a station from the list to view detailed information and manage bikes at that location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationManagement;
