
import React, { useState, useEffect } from 'react';
import { bikes, stations, maintenanceReports, users } from '@/data/mockData';
import { Station, Bike } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StationBikesList from '@/components/StationBikesList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { CustomPagination } from '@/components/ui/custom-pagination';

const StationAdminDashboard = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStation, setCurrentStation] = useState<Station | undefined>(undefined);
  const [stationBikes, setStationBikes] = useState<Bike[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = authState.user;
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (currentUser?.stationId) {
      const userStation = stations.find(station => station.id === currentUser.stationId);
      if (userStation) {
        setCurrentStation(userStation);
        const stationBikeList = bikes.filter(bike => bike.stationId === userStation.id);
        setStationBikes(stationBikeList);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      const results = stationBikes.filter(bike =>
        bike.id.toLowerCase().includes(lowercasedFilter) ||
        bike.model.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredBikes(results);
    } else {
      setFilteredBikes(stationBikes);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, stationBikes]);

  const handleAddBike = () => {
    navigate('/register-bike');
  };
  
  // Get paginated bikes
  const getPaginatedBikes = () => {
    const indexOfLastBike = currentPage * itemsPerPage;
    const indexOfFirstBike = indexOfLastBike - itemsPerPage;
    return filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-graydark">Station Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {authState.user?.name}!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleAddBike}>Add Bike</Button>
        </div>
      </div>

      {currentStation && (
        <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-graydark mb-4">
            {currentStation.name} - Bikes Overview
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <p className="text-muted-foreground">
              Manage bikes assigned to this station.
            </p>
            <Input
              type="text"
              placeholder="Search bikes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 mt-3 md:mt-0 text-graydark"
            />
          </div>

          {getPaginatedBikes().length > 0 ? (
            <div className="space-y-4">
              {/* Replace with directly listing paginated bikes in a table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Battery</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {getPaginatedBikes().map((bike) => (
                      <tr key={bike.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{bike.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{bike.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${bike.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
                              bike.status === 'in-use' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 
                              'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}
                          >
                            {bike.status.charAt(0).toUpperCase() + bike.status.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{bike.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {bike.batteryPercentage !== undefined ? `${bike.batteryPercentage}%` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredBikes.length > itemsPerPage && (
                <div className="mt-4">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredBikes.length}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No bikes found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationAdminDashboard;
