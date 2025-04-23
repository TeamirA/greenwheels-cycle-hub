
import { useState } from 'react';
import { stations, bikes, users, maintenanceReports } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bike, Users, Wrench, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StationMap from '@/components/StationMap';
import { Bike as BikeType } from '@/types';

const StationAdminDashboard = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  // Assuming the first station for demo purposes
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  
  // Filter bikes for the selected station
  const stationBikes = bikes.filter(bike => bike.stationId === selectedStation.id);
  
  // Filter station staff
  const stationStaff = users.filter(user => 
    (user.role === 'staff' || user.role === 'maintenance') && user.stationId === selectedStation.id
  );
  
  // Get maintenance reports for this station's bikes
  const stationBikeIds = stationBikes.map(bike => bike.id);
  const stationMaintenanceReports = maintenanceReports.filter(
    report => stationBikeIds.includes(report.bikeId)
  );
  
  // Count stats
  const availableBikes = stationBikes.filter(bike => bike.status === 'available').length;
  const inUseBikes = stationBikes.filter(bike => bike.status === 'in-use').length;
  const maintenanceBikes = stationBikes.filter(bike => bike.status === 'maintenance').length;
  const pendingReports = stationMaintenanceReports.filter(report => report.status === 'pending').length;
  
  const bikesByCategory = stationBikes.reduce((acc, bike) => {
    acc[bike.category] = (acc[bike.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Station Admin Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage {selectedStation.name} station</p>
        </div>
      </div>

      {/* Station Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Available Bikes</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{availableBikes}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <Bike className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
            {Math.round((availableBikes / selectedStation.capacity) * 100)}% of capacity
          </div>
        </Card>
        
        <Card className="p-5 border dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">In Use Bikes</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{inUseBikes}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Bike className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
            {Math.round((inUseBikes / stationBikes.length) * 100)}% of fleet
          </div>
        </Card>
        
        <Card className="p-5 border dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Staff Members</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{stationStaff.length}</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
            {stationStaff.filter(user => user.role === 'staff').length} staff, {stationStaff.filter(user => user.role === 'maintenance').length} maintenance
          </div>
        </Card>
        
        <Card className="p-5 border dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Pending Maintenance</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{pendingReports}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
              <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
            {maintenanceBikes} bikes currently out of service
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Station Map */}
        <Card className="border dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold flex items-center dark:text-white">
              <MapPin className="mr-2" size={18} />
              Station Location
            </h2>
          </div>
          <div className="p-4">
            <div className="h-[300px] rounded-md overflow-hidden">
              <StationMap
                stations={[selectedStation]}
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
              />
            </div>
          </div>
        </Card>

        {/* Station Bikes */}
        <Card className="border dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4 border-b flex justify-between items-center dark:border-gray-700">
            <h2 className="text-lg font-semibold flex items-center dark:text-white">
              <Bike className="mr-2" size={18} />
              Station Bikes
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search bikes..." className="pl-9 w-48 h-8 dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-0">
            <div className="max-h-[300px] overflow-auto">
              {stationBikes.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">ID</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">Model</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">Category</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {stationBikes.map((bike) => (
                      <tr key={bike.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-3 text-sm dark:text-gray-300">{bike.id}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{bike.model}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{bike.category}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            bike.status === 'available'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : bike.status === 'in-use'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {bike.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-muted-foreground dark:text-gray-400">
                  No bikes assigned to this station
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/register-station-staff')} 
            className="h-auto py-3 justify-start px-4 space-x-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            variant="outline"
          >
            <Users className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Register New Staff</p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">Add staff or maintenance team member</p>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/station-staff')} 
            className="h-auto py-3 justify-start px-4 space-x-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            variant="outline"
          >
            <Users className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Manage Staff</p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">View and edit station staff</p>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/station-reports')} 
            className="h-auto py-3 justify-start px-4 space-x-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            variant="outline"
          >
            <Wrench className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Maintenance Reports</p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">View pending maintenance issues</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StationAdminDashboard;
