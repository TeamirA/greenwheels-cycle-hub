
import { useState, useMemo } from 'react';
import { maintenanceReports, bikes, stations } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Tab, Tabs, TabList, TabPanel } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Wrench, CheckCircle, AlertTriangle, Filter, Search, MapPin } from 'lucide-react';
import StationMap from '@/components/StationMap';

const MaintenanceDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showBikeMap, setShowBikeMap] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [reportSource, setReportSource] = useState<'user' | 'staff'>('user');

  // Separate reports by source
  const userReports = maintenanceReports.filter(report => report.reportedBy.includes('user'));
  const staffReports = maintenanceReports.filter(report => !report.reportedBy.includes('user'));

  const filteredReports = useMemo(() => {
    const reportsToFilter = reportSource === 'user' ? userReports : staffReports;
    
    let results = [...reportsToFilter];
    
    if (statusFilter !== 'all') {
      results = results.filter(report => report.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      results = results.filter(report => report.priority === priorityFilter);
    }
    
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      results = results.filter(
        report => 
          report.bikeId.toLowerCase().includes(lowercasedFilter) ||
          report.issue.toLowerCase().includes(lowercasedFilter) ||
          report.description.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return results;
  }, [searchTerm, statusFilter, priorityFilter, reportSource, userReports, staffReports]);
  
  const selectedReport = selectedReportId ? maintenanceReports.find(r => r.id === selectedReportId) : null;
  const selectedBike = selectedBikeId ? bikes.find(b => b.id === selectedBikeId) : null;
  
  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    toast({
      title: 'Status Updated',
      description: `Report ${id} has been marked as ${newStatus}`
    });
    setSelectedReportId(null);
  };
  
  const handleShowBikeLocation = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    setShowBikeMap(true);
  };
  
  // Find station for the selected bike
  const selectedBikeStation = selectedBike ? stations.find(s => s.id === selectedBike.stationId) : null;
  
  // Map pins for visualization
  const mapPins = selectedBikeStation ? [
    {
      ...selectedBikeStation,
      bikeId: selectedBikeId,
      customPin: true,
      pinType: 'bike'
    }
  ] : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Maintenance Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage and track bike maintenance across all stations</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setReportSource('user')} 
            variant={reportSource === 'user' ? "default" : "outline"}
            className="relative"
          >
            User Reports
            {userReports.filter(r => r.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {userReports.filter(r => r.status === 'pending').length}
              </span>
            )}
          </Button>
          <Button 
            onClick={() => setReportSource('staff')} 
            variant={reportSource === 'staff' ? "default" : "outline"}
            className="relative"
          >
            Staff Reports
            {staffReports.filter(r => r.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {staffReports.filter(r => r.status === 'pending').length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by bike ID, issue or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-graydark dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-graylight dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <Wrench className="mr-2" size={18} />
            {reportSource === 'user' ? 'User Reported Issues' : 'Staff Reported Issues'}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-graylight dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Bike ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Reported At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleShowBikeLocation(report.bikeId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-300">
                    {report.bikeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {report.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.priority === 'high' ? 'bg-error/20 text-error dark:bg-error/30 dark:text-red-400' : 
                        report.priority === 'medium' ? 'bg-greenaccent/30 text-graydark dark:bg-greenaccent/40 dark:text-gray-200' : 
                        'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300'}`}
                    >
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.status === 'pending' ? 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300' : 
                        report.status === 'in-progress' ? 'bg-greenaccent/30 text-graydark dark:bg-greenaccent/40 dark:text-gray-200' : 
                        'bg-greenprimary/20 text-greenprimary dark:bg-greenprimary/30 dark:text-green-400'}`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {new Date(report.reportedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    <div className="flex space-x-2">
                      {report.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center dark:border-gray-600 dark:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportId(report.id);
                          }}
                        >
                          <Wrench className="mr-1" size={14} />
                          Start Work
                        </Button>
                      )}
                      {report.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center dark:border-gray-600 dark:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportId(report.id);
                          }}
                        >
                          <CheckCircle className="mr-1" size={14} />
                          Resolve
                        </Button>
                      )}
                      {report.status === 'resolved' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No maintenance issues found matching your criteria.
          </div>
        )}
      </div>

      {/* Map display */}
      {showBikeMap && selectedBikeStation && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Bike Location</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBikeMap(false)}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Close Map
            </Button>
          </div>
          
          <div className="bg-graylight dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium dark:text-gray-300">Bike ID</p>
                <p className="text-lg dark:text-white">{selectedBikeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-gray-300">Station</p>
                <p className="text-lg dark:text-white">{selectedBikeStation.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-gray-300">Location</p>
                <p className="text-lg dark:text-white">{selectedBikeStation.location}</p>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] rounded-lg overflow-hidden border dark:border-gray-700">
            <StationMap stations={mapPins} selectedStationId={selectedBikeStation.id} />
          </div>
        </div>
      )}

      {/* Status Update Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReportId} onOpenChange={() => setSelectedReportId(null)}>
          <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">{selectedReport.status === 'pending' ? 'Start Work on Issue' : 'Resolve Issue'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-graylight p-4 rounded-md dark:bg-gray-700">
                <div className="grid grid-cols-1 gap-2">
                  <p className="dark:text-gray-300"><span className="font-medium">Bike ID:</span> {selectedReport.bikeId}</p>
                  <p className="dark:text-gray-300"><span className="font-medium">Issue:</span> {selectedReport.issue}</p>
                  <p className="dark:text-gray-300"><span className="font-medium">Description:</span> {selectedReport.description}</p>
                  <p className="dark:text-gray-300"><span className="font-medium">Reported by:</span> {selectedReport.reportedBy}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md dark:bg-yellow-900/30 dark:border-yellow-800">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" size={16} />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {selectedReport.status === 'pending' 
                      ? 'You are about to start work on this issue. This will mark it as "In Progress".' 
                      : 'You are about to mark this issue as "Resolved". Make sure all repairs have been completed.'}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedReportId(null)}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={() => handleUpdateStatus(
                  selectedReport.id, 
                  selectedReport.status === 'pending' ? 'in-progress' : 'resolved'
                )}
              >
                {selectedReport.status === 'pending' ? 'Start Work' : 'Mark as Resolved'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaintenanceDashboard;
