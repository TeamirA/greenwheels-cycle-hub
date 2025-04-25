import { useState } from 'react';
import { bikes, stations } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Battery, Bike as BikeIcon, MapPin, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CustomPagination } from '@/components/ui/custom-pagination';

const AvailableBikes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Filter only available bikes
  const availableBikes = bikes.filter(bike => bike.status === 'available');
  
  // Group bikes by station first
  const bikesByStation = availableBikes.reduce((acc, bike) => {
    const stationId = bike.stationId;
    if (!acc[stationId]) {
      acc[stationId] = [];
    }
    acc[stationId].push(bike);
    return acc;
  }, {} as Record<string, typeof availableBikes>);
  
  const stationEntries = Object.entries(bikesByStation);
  const indexOfLastStation = currentPage * itemsPerPage;
  const indexOfFirstStation = indexOfLastStation - itemsPerPage;
  const currentStations = stationEntries.slice(indexOfFirstStation, indexOfLastStation);
  const totalPages = Math.ceil(stationEntries.length / itemsPerPage);

  // Calculate battery stats
  const bikesWithBattery = availableBikes.filter(bike => bike.batteryPercentage !== undefined);
  const totalBatteryPercentage = bikesWithBattery.reduce((sum, bike) => sum + (bike.batteryPercentage || 0), 0);
  const averageBattery = bikesWithBattery.length > 0 
    ? Math.round(totalBatteryPercentage / bikesWithBattery.length) 
    : 0;
  
  const highBatteryCount = bikesWithBattery.filter(bike => (bike.batteryPercentage || 0) >= 80).length;
  const mediumBatteryCount = bikesWithBattery.filter(bike => {
    const battery = bike.batteryPercentage || 0;
    return battery >= 30 && battery < 80;
  }).length;
  const lowBatteryCount = bikesWithBattery.filter(bike => (bike.batteryPercentage || 0) < 30).length;
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: 'Data Refreshed',
        description: 'Available bike data has been updated',
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
            <h1 className="text-2xl font-bold text-graydark">Available Bikes</h1>
            <p className="text-muted-foreground">
              {availableBikes.length} bikes ready for rental across {Object.keys(bikesByStation).length} stations
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCcw size={16} className="mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw size={16} className="mr-2" />
              Refresh Data
            </>
          )}
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Bikes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenprimary">{availableBikes.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((availableBikes.length / bikes.length) * 100)}% of total fleet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageBattery}%</div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${
                  averageBattery > 70 ? 'bg-greenprimary' : 
                  averageBattery > 30 ? 'bg-greenaccent' : 
                  'bg-error'
                }`} 
                style={{ width: `${averageBattery}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">High Battery (&gt;80%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-greenprimary">{highBatteryCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((highBatteryCount / bikesWithBattery.length) * 100)}% of available bikes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Low Battery (&lt;30%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">{lowBatteryCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((lowBatteryCount / bikesWithBattery.length) * 100)}% of available bikes
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentStations.map(([stationId, stationBikes]) => {
          const station = stations.find(s => s.id === stationId);
          if (!station) return null;
          
          // Calculate station battery stats
          const stationAvgBattery = stationBikes
            .filter(bike => bike.batteryPercentage !== undefined)
            .reduce((sum, bike) => sum + (bike.batteryPercentage || 0), 0) / 
            stationBikes.filter(bike => bike.batteryPercentage !== undefined).length;
          
          return (
            <Card key={stationId} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium text-graydark flex items-center">
                    <MapPin size={16} className="mr-1 text-greenprimary" />
                    {station.name}
                  </CardTitle>
                  <span className="text-xs bg-greenprimary/10 text-greenprimary px-2 py-1 rounded-full">
                    {stationBikes.length}/{station.capacity} bikes
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{station.location}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {stationBikes.map(bike => (
                    <div key={bike.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <BikeIcon size={16} className="mr-2 text-graydark" />
                        <div>
                          <p className="text-sm font-medium">{bike.model}</p>
                          <p className="text-xs text-gray-500">{bike.id}</p>
                        </div>
                      </div>
                      {bike.batteryPercentage !== undefined && (
                        <div className="flex items-center">
                          <Battery size={16} className={`mr-1 ${
                            bike.batteryPercentage > 70 ? 'text-greenprimary' : 
                            bike.batteryPercentage > 30 ? 'text-greenaccent' : 
                            'text-error'
                          }`} />
                          <span className="text-sm">{bike.batteryPercentage}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {stationBikes.length === 0 && (
                  <p className="text-center py-4 text-gray-500">No available bikes at this station</p>
                )}
                
                {stationBikes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Avg. Battery:</span>
                      <span>{Math.round(stationAvgBattery)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                      <div 
                        className={`h-full rounded-full ${
                          stationAvgBattery > 70 ? 'bg-greenprimary' : 
                          stationAvgBattery > 30 ? 'bg-greenaccent' : 
                          'bg-error'
                        }`} 
                        style={{ width: `${stationAvgBattery}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stationEntries.length > itemsPerPage && (
        <div className="mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={stationEntries.length}
          />
        </div>
      )}
    </div>
  );
};

export default AvailableBikes;
