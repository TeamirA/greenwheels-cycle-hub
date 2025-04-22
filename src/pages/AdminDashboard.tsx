
import { useEffect, useState } from 'react';
import { Bike, MapPin, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/ui/dashboard-card';
import BikeStatusBadge from '@/components/ui/bike-status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { bikes, users, stations, maintenanceReports, getBikeSummary, getStationSummary, getMaintenanceSummary } from '@/data/mockData';
import { Bike as BikeType, MaintenanceReport } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [bikeSummary, setBikeSummary] = useState(getBikeSummary());
  const [stationSummary, setStationSummary] = useState(getStationSummary());
  const [maintenanceSummary, setMaintenanceSummary] = useState(getMaintenanceSummary());
  const [bikeList, setBikeList] = useState<BikeType[]>(bikes);
  const [filteredBikes, setFilteredBikes] = useState<BikeType[]>(bikes);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<MaintenanceReport[]>(
    maintenanceReports.slice(0, 5)
  );

  const bikesPerPage = 5;

  // Simulate data refresh at intervals
  useEffect(() => {
    const refreshData = () => {
      setLoading(true);
      
      setTimeout(() => {
        // Simulate random changes to the data
        const updatedBikeSummary = {
          ...bikeSummary,
          availableBikes: bikeSummary.availableBikes + Math.floor(Math.random() * 3) - 1,
          inUseBikes: bikeSummary.inUseBikes + Math.floor(Math.random() * 3) - 1,
        };
        
        setBikeSummary(updatedBikeSummary);
        setLoading(false);
        
        toast({
          title: 'Dashboard Updated',
          description: 'Live data has been refreshed',
          variant: 'default',
        });
      }, 1000);
    };
    
    // Set an interval to refresh data every 5 minutes (300000ms)
    // For demo purposes, we'll use a shorter interval
    const intervalId = setInterval(refreshData, 300000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [bikeSummary, toast]);

  // Filter bikes based on search and status filter
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

  // Paginate bikes
  const indexOfLastBike = currentPage * bikesPerPage;
  const indexOfFirstBike = indexOfLastBike - bikesPerPage;
  const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
  const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle card clicks - navigate to detail pages
  const handleCardClick = (type: string) => {
    switch (type) {
      case 'allBikes':
        navigate('/bike-fleet');
        break;
      case 'inUseBikes':
        navigate('/active-rides');
        break;
      case 'availableBikes':
        navigate('/available-bikes');
        break;
      case 'stations':
        navigate('/station-management');
        break;
      default:
        break;
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    toast({
      title: 'Report Exported',
      description: 'CSV file downloaded successfully',
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-graydark">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {authState.user?.name}!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setBikeSummary(getBikeSummary());
                setStationSummary(getStationSummary());
                setMaintenanceSummary(getMaintenanceSummary());
                setLoading(false);
              }, 1000);
            }}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => handleCardClick('allBikes')} className="cursor-pointer hover:scale-105 transition-transform">
          <DashboardCard 
            title="Total Bikes" 
            value={bikeSummary.totalBikes} 
            icon={<Bike size={24} className="text-greenprimary" />}
            color="var(--greenprimary)"
            loading={loading}
          />
        </div>
        <div onClick={() => handleCardClick('inUseBikes')} className="cursor-pointer hover:scale-105 transition-transform">
          <DashboardCard 
            title="Bikes in Use" 
            value={bikeSummary.inUseBikes}
            trend={`${Math.round((bikeSummary.inUseBikes / bikeSummary.totalBikes) * 100)}% of fleet`}
            icon={<Bike size={24} className="text-greenaccent" />}
            color="var(--greenaccent)"
            loading={loading}
          />
        </div>
        <div onClick={() => handleCardClick('availableBikes')} className="cursor-pointer hover:scale-105 transition-transform">
          <DashboardCard 
            title="Available Bikes" 
            value={bikeSummary.availableBikes}
            icon={<Bike size={24} className="text-greenprimary" />}
            color="var(--greenprimary)"
            loading={loading}
          />
        </div>
        <div onClick={() => handleCardClick('stations')} className="cursor-pointer hover:scale-105 transition-transform">
          <DashboardCard 
            title="Docking Stations" 
            value={stationSummary.totalStations}
            trend={`${stationSummary.utilization}% capacity utilization`}
            icon={<MapPin size={24} className="text-graydark" />}
            color="var(--graydark)"
            loading={loading}
          />
        </div>
      </div>

      {/* Bike Inventory Table */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold text-graydark">Bike Inventory</h2>
          <div className="mt-3 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search bikes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 text-graydark"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-graydark"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

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
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Last Maintenance
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
                    <BikeStatusBadge status={bike.status} pulseOnUpdate={loading} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {bike.batteryPercentage ? `${bike.batteryPercentage}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {new Date(bike.lastMaintenance).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-greenprimary hover:bg-greenprimary/80" : ""}
                >
                  {page}
                </Button>
              ))}
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

      {/* Recent Maintenance Issues */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-graydark">Recent Maintenance Issues</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Bike ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-graydark">
                    {report.bikeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {report.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.priority === 'high' ? 'bg-error/20 text-error' : 
                        report.priority === 'medium' ? 'bg-greenaccent/30 text-graydark' : 
                        'bg-gray-100 text-gray-500'}`}
                    >
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.status === 'pending' ? 'bg-gray-100 text-gray-600' : 
                        report.status === 'in-progress' ? 'bg-greenaccent/30 text-graydark' : 
                        'bg-greenprimary/20 text-greenprimary'}`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
