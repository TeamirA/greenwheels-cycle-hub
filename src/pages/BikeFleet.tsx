
import { useState, useEffect } from 'react';
import { bikes, stations } from '@/data/mockData';
import { Bike as BikeType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bike, Filter, ArrowLeft } from 'lucide-react';
import BikeStatusBadge from '@/components/ui/bike-status-badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const BikeFleet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bikeList, setBikeList] = useState<BikeType[]>(bikes);
  const [filteredBikes, setFilteredBikes] = useState<BikeType[]>(bikes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const bikesPerPage = 10;
  
  // Apply filters
  useEffect(() => {
    let results = bikes;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(bike => bike.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      results = results.filter(
        bike => 
          bike.id.toLowerCase().includes(lowercasedFilter) ||
          bike.model.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    setFilteredBikes(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter]);
  
  // Pagination
  const indexOfLastBike = currentPage * bikesPerPage;
  const indexOfFirstBike = indexOfLastBike - bikesPerPage;
  const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
  const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);
  
  // Statistics calculation
  const availableCount = bikeList.filter(bike => bike.status === 'available').length;
  const inUseCount = bikeList.filter(bike => bike.status === 'in-use').length;
  const maintenanceCount = bikeList.filter(bike => bike.status === 'maintenance').length;
  const averageBattery = bikeList
    .filter(bike => bike.batteryPercentage !== undefined)
    .reduce((sum, bike) => sum + (bike.batteryPercentage || 0), 0) / 
    bikeList.filter(bike => bike.batteryPercentage !== undefined).length;
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const handleExportCSV = () => {
    toast({
      title: 'Fleet Data Exported',
      description: 'Bike fleet data has been exported to CSV',
      variant: 'default',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin-dashboard')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-graydark">Bike Fleet Management</h1>
            <p className="text-muted-foreground">Complete overview of all bikes in the system</p>
          </div>
        </div>
        <Button onClick={handleExportCSV}>Export Data</Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bikes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bikeList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenprimary">{availableCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((availableCount / bikeList.length) * 100)}% of fleet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenaccent">{inUseCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((inUseCount / bikeList.length) * 100)}% of fleet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageBattery)}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow">
        <div className="relative w-full sm:w-auto flex-grow">
          <Input
            type="text"
            placeholder="Search bikes by ID or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Bike size={16} className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-grow sm:flex-grow-0 px-3 py-2 rounded-md border border-input bg-background text-graydark"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      
      {/* Bikes Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Bike ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Total Rides
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-graydark">
                    {bike.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {bike.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <BikeStatusBadge status={bike.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {stations.find(s => s.id === bike.stationId)?.name || 'In transit'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {bike.batteryPercentage ? (
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              bike.batteryPercentage > 70 ? 'bg-greenprimary' : 
                              bike.batteryPercentage > 30 ? 'bg-greenaccent' : 
                              'bg-error'
                            }`}
                            style={{ width: `${bike.batteryPercentage}%` }}
                          />
                        </div>
                        <span>{bike.batteryPercentage}%</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {new Date(bike.lastMaintenance).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {bike.totalRides}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-graydark">
              Showing {indexOfFirstBike + 1} to {Math.min(indexOfLastBike, filteredBikes.length)} of {filteredBikes.length} bikes
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                
                return pageNumber <= totalPages ? (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "bg-greenprimary hover:bg-greenprimary/80" : ""}
                  >
                    {pageNumber}
                  </Button>
                ) : null;
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeFleet;
