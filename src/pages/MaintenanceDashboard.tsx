
import { useState, useEffect } from 'react';
import { bikes, maintenanceReports, stations } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Wrench, User, FileText, Search } from 'lucide-react';
import StationMap from '@/components/StationMap';
import { MaintenanceReport } from '@/types';
import { useToast } from '@/hooks/use-toast';

const MaintenanceDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('user-reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [viewingList, setViewingList] = useState(true);
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // User-reported vs staff-reported
  const userReports = maintenanceReports.filter(r => r.reportedBy.startsWith('user-'));
  const staffReports = maintenanceReports.filter(r => r.reportedBy.startsWith('staff-'));

  // Determine which reports to use based on active tab
  const reportsToUse = activeTab === 'user-reports' ? userReports : staffReports;

  // Filter reports based on search and filter
  useEffect(() => {
    let filtered = reportsToUse;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.description.toLowerCase().includes(term) || 
        report.bikeId.toLowerCase().includes(term) ||
        report.issue.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    setFilteredReports(filtered);
  }, [reportsToUse, searchTerm, statusFilter]);

  // Get the bike details for a report
  const getBikeDetails = (bikeId: string) => {
    return bikes.find(b => b.id === bikeId);
  };

  // Get the station name for a bike
  const getStationName = (bikeId: string) => {
    const bike = getBikeDetails(bikeId);
    if (!bike) return 'Unknown';
    
    const station = stations.find(s => s.id === bike.stationId);
    return station ? station.name : 'Unknown';
  };

  // Show bike on map
  const viewOnMap = (report: MaintenanceReport) => {
    const bike = getBikeDetails(report.bikeId);
    if (!bike) return;
    
    const bikeStation = stations.find(s => s.id === bike.stationId);
    if (!bikeStation) return;
    
    setSelectedStation(bikeStation);
    setSelectedReport(report);
    setViewingList(false);
  };

  // Handle maintenance status change
  const updateMaintenanceStatus = (reportId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    toast({
      title: 'Status Updated',
      description: `Report status changed to ${newStatus}`,
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Maintenance Dashboard</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage maintenance issues and repairs</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <TabsList className="mb-4 sm:mb-0 dark:bg-gray-700">
            <TabsTrigger value="user-reports" className="dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
              <User className="mr-2" size={16} />
              User Reports
            </TabsTrigger>
            <TabsTrigger value="staff-reports" className="dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
              <FileText className="mr-2" size={16} />
              Staff Reports
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graydark/60 dark:text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-48 text-graydark dark:text-white dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 h-10 rounded-md border border-input bg-background text-graydark dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            {!viewingList && (
              <Button 
                variant="outline" 
                onClick={() => setViewingList(true)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Back to List
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="user-reports" className="mt-0">
          {viewingList ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Bike
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Issue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Station
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredReports.map((report) => {
                      const bike = getBikeDetails(report.bikeId);
                      return (
                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-graydark dark:text-white">
                            {report.id.substring(0, 8)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                            {bike?.model || 'Unknown'} ({report.bikeId.substring(0, 8)})
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                            {report.issue}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                            {getStationName(report.bikeId)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                report.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${report.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                report.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}
                            >
                              {report.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark space-x-2 dark:text-gray-300">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewOnMap(report)}
                              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                              <MapPin size={14} className="mr-1" />
                              Map
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReport(report)}
                              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredReports.length === 0 && (
                <div className="py-8 text-center text-muted-foreground dark:text-gray-400">
                  No maintenance reports found.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border h-[450px] dark:border-gray-700 dark:bg-gray-800">
                  <div className="p-4 border-b flex justify-between items-center dark:border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center dark:text-white">
                      <MapPin className="mr-2" size={18} />
                      Bike Location
                    </h2>
                  </div>
                  <div className="p-0">
                    <div className="h-[400px]">
                      <StationMap 
                        stations={stations} 
                        selectedStation={selectedStation}
                        onStationSelect={setSelectedStation}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                {selectedReport && (
                  <Card className="border h-[450px] overflow-auto dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-4 border-b dark:border-gray-700">
                      <h2 className="text-lg font-semibold flex items-center dark:text-white">
                        <Wrench className="mr-2" size={18} />
                        Maintenance Details
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Issue</h3>
                        <p className="font-medium dark:text-white">{selectedReport.issue}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Description</h3>
                        <p className="dark:text-gray-300">{selectedReport.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Bike Details</h3>
                        <div className="flex flex-col space-y-1 dark:text-gray-300">
                          <p>ID: {selectedReport.bikeId}</p>
                          <p>Model: {getBikeDetails(selectedReport.bikeId)?.model || 'Unknown'}</p>
                          <p>Station: {getStationName(selectedReport.bikeId)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Report Details</h3>
                        <div className="flex flex-col space-y-1 dark:text-gray-300">
                          <p>Date: {new Date(selectedReport.reportedAt).toLocaleDateString()}</p>
                          <p>Priority: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                            ${selectedReport.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                              selectedReport.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                            {selectedReport.priority}
                          </span></p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground dark:text-gray-400">Update Status</h3>
                        <div className="flex flex-col space-y-2">
                          <Button 
                            onClick={() => updateMaintenanceStatus(selectedReport.id, 'in-progress')}
                            disabled={selectedReport.status === 'in-progress'}
                            className={`justify-center ${selectedReport.status === 'in-progress' ? 'bg-opacity-50' : ''}`}
                          >
                            Start Work
                          </Button>
                          <Button 
                            onClick={() => updateMaintenanceStatus(selectedReport.id, 'resolved')}
                            disabled={selectedReport.status === 'resolved' || selectedReport.status === 'pending'}
                            className={`justify-center ${selectedReport.status === 'resolved' ? 'bg-opacity-50' : ''}`}
                            variant="outline"
                          >
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="staff-reports" className="mt-0">
          {/* Same structure as user-reports tab, but with staff reports */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Bike</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Reported By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredReports.map((report) => {
                    const bike = getBikeDetails(report.bikeId);
                    return (
                      <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-graydark dark:text-white">{report.id.substring(0, 8)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">{bike?.model || 'Unknown'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">{report.issue}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">Staff</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                              report.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${report.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                              report.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                            {report.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark space-x-2 dark:text-gray-300">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => viewOnMap(report)}
                            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          >
                            <MapPin size={14} className="mr-1" />
                            Map
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateMaintenanceStatus(report.id, 'in-progress')}
                            variant="default"
                            disabled={report.status !== 'pending'}
                            className={`${report.status !== 'pending' ? 'opacity-50' : ''}`}
                          >
                            Start
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {filteredReports.length === 0 && (
              <div className="py-8 text-center text-muted-foreground dark:text-gray-400">
                No staff reports found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceDashboard;
