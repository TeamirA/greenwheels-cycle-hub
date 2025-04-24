import React, { useState, useEffect } from 'react';
import { bikes, stations, maintenanceReports, users } from '@/data/mockData';
import { Station, Bike } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StationBikesList from '@/components/StationBikesList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

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
  }, [searchTerm, stationBikes]);

  const handleAddBike = () => {
    navigate('/register-bike');
  };

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

          {filteredBikes.length > 0 ? (
            <div className="space-y-4">
              <StationBikesList stationName={currentStation.name} bikes={filteredBikes} />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No bikes found for this station.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationAdminDashboard;
