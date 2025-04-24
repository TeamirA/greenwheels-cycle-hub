import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bikes, maintenanceReports, stations, users } from '@/data/mockData';
import { Bike, MapPin, Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StationMap from '@/components/StationMap';

interface MaintenanceDashboardProps {
  reportSource?: 'user' | 'staff';
}

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ reportSource }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState(maintenanceReports);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Filter reports based on the reportSource prop
    let filteredReports = maintenanceReports;
    
    if (reportSource === 'staff') {
      // Filter reports relevant to staff (e.g., high priority or specific issues)
      filteredReports = maintenanceReports.filter(report => report.priority === 'high');
    } else {
      // Show all user-generated reports by default
      filteredReports = maintenanceReports.filter(report => report.reporterType === 'user');
    }
    
    setReports(filteredReports);
  }, [reportSource]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredReports = reports.filter(report =>
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.bikeId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleResolve = (reportId: string) => {
    // Update the status of the report to 'resolved'
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, status: 'resolved' } : report
    );
    setReports(updatedReports);
    
    // Show a toast notification
    toast({
      title: 'Issue Resolved',
      description: 'The maintenance issue has been marked as resolved.',
    });
  };
  
  const handleBikeSelect = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    setShowMap(true);
  };
  
  const bikeLocations = bikes.map(bike => {
    const station = stations.find(station => station.id === bike.stationId);
    return {
      id: bike.id,
      name: bike.name,
      location: station ? { latitude: station.latitude, longitude: station.longitude } : null,
    };
  }).filter(bike => bike.location !== null);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Maintenance Dashboard</h1>
      <p className="text-muted-foreground dark:text-gray-400">
        View and manage maintenance issues reported by users and staff
      </p>
      
      <Tabs defaultValue="user-reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="staff-reports">Staff Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-reports" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">User Reported Issues</h2>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map(report => (
              <Card key={report.id} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between dark:text-white">
                    {report.description.substring(0, 50)}
                    <Badge variant="secondary">
                      {report.status === 'pending' ? 'Pending' : 'Resolved'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bike className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bike ID: {report.bikeId}</p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Priority: {report.priority}</p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <Button variant="link" onClick={() => handleBikeSelect(report.bikeId)}>
                      View Bike Location
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reported by: {users.find(user => user.id === report.reporterId)?.name || 'Unknown'}
                  </p>
                  <div className="flex justify-end mt-4">
                    {report.status === 'pending' && (
                      <Button onClick={() => handleResolve(report.id)}>Mark as Resolved</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {showMap && selectedBikeId && (
            <div className="mt-6 h-[400px] rounded-md border dark:border-gray-700">
              <StationMap 
                stations={bikeLocations}
                selectedStation={selectedBikeId} 
                onStationSelect={(id) => console.log('Selected bike:', id)} 
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="staff-reports" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">Staff Reported Issues</h2>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map(report => (
              <Card key={report.id} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between dark:text-white">
                    {report.description.substring(0, 50)}
                    <Badge variant="secondary">
                      {report.status === 'pending' ? 'Pending' : 'Resolved'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bike className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bike ID: {report.bikeId}</p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Priority: {report.priority}</p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <Button variant="link" onClick={() => handleBikeSelect(report.bikeId)}>
                      View Bike Location
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reported by: {users.find(user => user.id === report.reporterId)?.name || 'Unknown'}
                  </p>
                  <div className="flex justify-end mt-4">
                    {report.status === 'pending' && (
                      <Button onClick={() => handleResolve(report.id)}>Mark as Resolved</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceDashboard;
