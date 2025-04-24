import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { stations, bikes, users as allUsers, maintenanceReports } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, MapPin, Wrench, Users, Bike, AlertTriangle, CheckCircle, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StationAdminDashboard = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStaffMembers: 0,
    totalMaintenanceMembers: 0,
    totalBikes: 0,
    availableBikes: 0,
    inUseBikes: 0,
    maintenanceBikes: 0,
    pendingIssues: 0,
    resolvedIssues: 0
  });
  
  const stationId = authState.user?.stationId || 'station-1';
  
  useEffect(() => {
    const stationData = stations.find(station => station.id === stationId);
    const stationBikes = bikes.filter(bike => bike.stationId === stationId);
    const stationUsers = allUsers.filter(user => user.stationId === stationId);
    const stationReports = maintenanceReports.filter(report => {
      const bike = bikes.find(b => b.id === report.bikeId);
      return bike && bike.stationId === stationId;
    });
    
    setStats({
      totalStaffMembers: stationUsers.filter(user => user.role === 'staff').length,
      totalMaintenanceMembers: stationUsers.filter(user => user.role === 'maintenance').length,
      totalBikes: stationBikes.length,
      availableBikes: stationBikes.filter(bike => bike.status === 'available').length,
      inUseBikes: stationBikes.filter(bike => bike.status === 'in-use').length,
      maintenanceBikes: stationBikes.filter(bike => bike.status === 'maintenance').length,
      pendingIssues: stationReports.filter(report => report.status === 'pending').length,
      resolvedIssues: stationReports.filter(report => report.status === 'resolved').length
    });
  }, [stationId]);

  const bikeStatusData = [
    { name: 'Available', value: stats.availableBikes, color: '#28B463' },
    { name: 'In Use', value: stats.inUseBikes, color: '#F7DC6F' },
    { name: 'Maintenance', value: stats.maintenanceBikes, color: '#E74C3C' },
  ];
  
  const bikeCategoryData = [
    { name: 'Regular', value: stationBikes.filter(b => b.category === 'regular').length },
    { name: 'Electric', value: stationBikes.filter(b => b.category === 'electric').length },
    { name: 'Scooter', value: stationBikes.filter(b => b.category === 'scooter').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Station Admin Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Managing {stations.find(station => station.id === stationId)?.name || 'Loading...'} at {stations.find(station => station.id === stationId)?.location || ''}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white dark:bg-gray-800 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/station-staff')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Station Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold dark:text-white">{stats.totalStaffMembers}</div>
              <Users className="h-6 w-6 text-greenprimary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400 flex items-center">
              View staff details <ArrowRight className="h-3 w-3 ml-1" />
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/maintenance-team')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Maintenance Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold dark:text-white">{stats.totalMaintenanceMembers}</div>
              <Wrench className="h-6 w-6 text-greenprimary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400 flex items-center">
              View team details <ArrowRight className="h-3 w-3 ml-1" />
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/station-bikes')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Station Bikes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold dark:text-white">{stats.totalBikes}</div>
              <Bike className="h-6 w-6 text-greenprimary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400 flex items-center">
              View all bikes <ArrowRight className="h-3 w-3 ml-1" />
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/station-reports')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Maintenance Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold dark:text-white">
                {stats.pendingIssues} <span className="text-sm text-muted-foreground dark:text-gray-400">pending</span>
              </div>
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400 flex items-center">
              View all reports <ArrowRight className="h-3 w-3 ml-1" />
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="dark:text-white">Station Bike Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bikeCategoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="value" name="Number of Bikes" fill="#28B463" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Bike Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bikeStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bikeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                    formatter={(value) => [value, 'Bikes']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={() => navigate('/register-station-staff')} className="h-auto py-6 w-full flex flex-col items-center justify-center gap-2">
            <UserPlus size={24} />
            <span>Register Staff</span>
          </Button>
          
          <Button onClick={() => navigate('/station-bikes')} variant="outline" className="h-auto py-6 w-full flex flex-col items-center justify-center gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <Bike size={24} />
            <span>Manage Bikes</span>
          </Button>
          
          <Button onClick={() => navigate('/maintenance-issues')} variant="outline" className="h-auto py-6 w-full flex flex-col items-center justify-center gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <AlertTriangle size={24} />
            <span>View Issues</span>
          </Button>
          
          <Button onClick={() => navigate('/active-rides')} variant="outline" className="h-auto py-6 w-full flex flex-col items-center justify-center gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <CheckCircle size={24} />
            <span>Active Rides</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StationAdminDashboard;
