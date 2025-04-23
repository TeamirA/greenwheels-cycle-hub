
import { useState, useEffect } from 'react';
import { bikes, stations, users, reservations } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Bike, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ActiveRides = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter only bikes in use
  const activeBikes = bikes.filter(bike => bike.status === 'in-use');
  
  // Get active reservations
  const activeReservations = reservations.filter(r => 
    r.status === 'active' || r.status === 'overdue'
  );
  
  // States for ride duration calculation
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshingData, setRefreshingData] = useState(false);
  
  // Calculate ride time percentages
  const shortRides = activeReservations.filter(r => getMinutesDifference(r.startTime) < 15).length;
  const mediumRides = activeReservations.filter(r => {
    const diff = getMinutesDifference(r.startTime);
    return diff >= 15 && diff < 30;
  }).length;
  const longRides = activeReservations.filter(r => getMinutesDifference(r.startTime) >= 30).length;
  
  const shortRidePercentage = Math.round((shortRides / activeReservations.length) * 100) || 0;
  const mediumRidePercentage = Math.round((mediumRides / activeReservations.length) * 100) || 0;
  const longRidePercentage = Math.round((longRides / activeReservations.length) * 100) || 0;
  
  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  function getMinutesDifference(startTimeStr: string): number {
    const startTime = new Date(startTimeStr);
    const diffMs = currentTime.getTime() - startTime.getTime();
    return Math.floor(diffMs / 60000); // convert to minutes
  }
  
  function formatDuration(startTimeStr: string): string {
    const minutes = getMinutesDifference(startTimeStr);
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }
  
  function getRowClass(startTimeStr: string): string {
    const minutes = getMinutesDifference(startTimeStr);
    if (minutes > 45) {
      return 'bg-error/10 dark:bg-error/20';
    } else if (minutes > 30) {
      return 'bg-amber-50 dark:bg-amber-900/30';
    }
    return '';
  }
  
  const handleRefreshData = () => {
    setRefreshingData(true);
    
    setTimeout(() => {
      setRefreshingData(false);
      toast({
        title: 'Ride Data Refreshed',
        description: 'Active ride information has been updated',
        variant: 'default',
      });
    }, 1000);
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
            <h1 className="text-2xl font-bold text-graydark dark:text-white">Active Rides</h1>
            <p className="text-muted-foreground dark:text-gray-300">Currently ongoing bike rides in the system</p>
          </div>
        </div>
        <Button 
          onClick={handleRefreshData}
          disabled={refreshingData}
        >
          {refreshingData ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-300">Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{activeReservations.length}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {Math.round((activeReservations.length / bikes.length) * 100)}% of fleet in use
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-300">Short Rides (&lt;15m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenprimary dark:text-green-400">{shortRides}</div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full bg-greenprimary dark:bg-green-400 rounded-full" 
                style={{ width: `${shortRidePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-300">Medium Rides (15-30m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenaccent dark:text-green-300">{mediumRides}</div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full bg-greenaccent dark:bg-green-300 rounded-full" 
                style={{ width: `${mediumRidePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-300">Long Rides (&gt;30m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{longRides}</div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${longRidePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Rides */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-graydark dark:text-white">Current Active Rides</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Bike
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  From Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activeReservations.map((reservation) => {
                const bike = bikes.find(b => b.id === reservation.bikeId);
                const station = stations.find(s => s.id === reservation.stationId);
                const user = users.find(u => u.id === reservation.userId);
                
                return (
                  <tr key={reservation.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getRowClass(reservation.startTime)}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <User size={16} className="text-graydark dark:text-gray-300" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-graydark dark:text-white">{user?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {reservation.userId.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                      <div className="flex items-center">
                        <Bike size={16} className="mr-1 text-graydark dark:text-gray-300" />
                        <span>{bike?.model || 'Unknown'} ({reservation.bikeId})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-greenprimary dark:text-green-400" />
                        <span>{station?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                      {new Date(reservation.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-graydark dark:text-gray-300" />
                        <span>{formatDuration(reservation.startTime)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reservation.status === 'active' 
                          ? 'bg-greenprimary/20 text-greenprimary dark:bg-green-900/50 dark:text-green-300'
                          : 'bg-error/20 text-error dark:bg-red-900/50 dark:text-red-300'
                      }`}>
                        {reservation.status === 'active' ? 'Active' : 'Overdue'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {activeReservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No active rides at the moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Map Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-graydark dark:text-white mb-4">Ride Locations</h2>
        <div className="h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-greenprimary dark:text-green-400 mb-2" />
            <p className="text-graydark dark:text-gray-300">Interactive ride map would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRides;
