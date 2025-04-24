import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { bikes, reservations, stations, getUserById } from '@/data/mockData';
import { Bike as BikeIcon, MapPin, Search, Wrench, Car } from 'lucide-react';
import StationMap, { StationMapLocation } from '@/components/StationMap';

const StaffPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [reservationCode, setReservationCode] = useState('');
  const [bikeDetails, setBikeDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const stationBikes = bikes.filter(bike => bike.stationId === selectedStation.id);
  
  const handleVerifyCode = () => {
    if (!reservationCode.trim()) {
      setErrorMessage('Please enter a reservation code');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage('');
    
    setTimeout(() => {
      const reservation = reservations.find(
        r => r.code && r.code.toLowerCase() === reservationCode.trim().toLowerCase()
      );
      
      if (reservation) {
        const bike = bikes.find(b => b.id === reservation.bikeId);
        const user = getUserById(reservation.userId);
        
        if (bike && user) {
          setBikeDetails({
            id: bike.id,
            model: bike.model,
            category: bike.category,
            status: bike.status,
            userName: user.name,
            userId: user.id,
            reservation: reservation
          });
          
          toast({
            title: 'Reservation Verified',
            description: 'Bike details retrieved successfully',
            variant: 'default',
          });
        } else {
          setErrorMessage('Error retrieving bike or user details');
        }
      } else {
        setErrorMessage('Invalid reservation code. Please check and try again.');
        toast({
          title: 'Verification Failed',
          description: 'Invalid reservation code',
          variant: 'destructive',
        });
      }
      
      setIsProcessing(false);
    }, 1000);
  };
  
  const handleStartRide = () => {
    toast({
      title: 'Ride Started',
      description: `${bikeDetails.userName} has started a ride on ${bikeDetails.model}`,
      variant: 'default',
    });
    
    setBikeDetails(null);
    setReservationCode('');
  };
  
  const handleRandomBike = () => {
    const randomBikeIndex = Math.floor(Math.random() * bikes.length);
    const bike = bikes[randomBikeIndex];
    const randomUserIndex = Math.floor(Math.random() * 3) + 3; // Users 3, 4, 5
    const user = getUserById(randomUserIndex.toString());
    
    setBikeDetails({
      id: bike.id,
      model: bike.model,
      category: bike.category,
      status: bike.status,
      userName: user?.name || 'Demo User',
      userId: user?.id || 'demo-id',
      reservation: {
        id: `R${Math.floor(1000 + Math.random() * 9000)}`,
        code: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        startTime: new Date().toISOString()
      }
    });
    
    toast({
      title: 'Demo Mode',
      description: 'Generated random bike details',
      variant: 'default',
    });
  };
  
  const handleNavigateToReservations = () => {
    navigate('/reservations');
  };
  
  const handleNavigateToMaintenance = () => {
    navigate('/maintenance-issues');
  };
  
  const stationLocations: StationMapLocation[] = stations.map(station => ({
    id: station.id,
    name: station.name,
    location: {
      latitude: station.coordinates.lat,
      longitude: station.coordinates.lng
    }
  }));
  
  const selectedStationId = selectedStation.id;
  
  const handleStationSelect = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      setSelectedStation(station);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Staff Control Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BikeIcon className="mr-2" size={20} />
            Reservation Verification
          </h2>
          
          {!bikeDetails ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="reservation-code" className="block text-sm font-medium mb-1 text-graydark dark:text-gray-300">
                  Enter Reservation Code
                </label>
                <div className="flex gap-2">
                  <Input
                    id="reservation-code"
                    value={reservationCode}
                    onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code"
                    className="uppercase"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleVerifyCode} 
                    disabled={isProcessing}
                    className="whitespace-nowrap"
                  >
                    {isProcessing ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
                {errorMessage && <p className="mt-2 text-sm text-error">{errorMessage}</p>}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={handleRandomBike}
                  className="text-sm"
                >
                  Demo: Show Random Bike
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-graylight p-4 rounded-lg animate-fade-in dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Bike Details</h3>
                <Button variant="outline" size="sm" onClick={() => setBikeDetails(null)}>
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                  <p className="font-medium">{bikeDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                  <p className="font-medium">{bikeDetails.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium capitalize">{bikeDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium capitalize">{bikeDetails.status.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                <p className="font-medium">{bikeDetails.userName} (ID: {bikeDetails.userId})</p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Reservation</p>
                <p className="font-medium">
                  {bikeDetails.reservation.id} 
                  {bikeDetails.reservation.code && ` (Code: ${bikeDetails.reservation.code})`}
                </p>
              </div>
              
              <div className="pt-3">
                <Button onClick={handleStartRide} className="w-full">
                  Start Ride
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-graylight p-4 rounded-lg hover:bg-graylight/80 cursor-pointer transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                 onClick={handleNavigateToReservations}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Reservations</h3>
                <span className="bg-graydark text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {reservations.filter(r => r.status === 'active').length}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage active reservations</p>
            </div>
            
            <div className="bg-graylight p-4 rounded-lg hover:bg-graylight/80 cursor-pointer transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                 onClick={handleNavigateToMaintenance}>
              <h3 className="font-medium mb-2">Maintenance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Report bike issues</p>
            </div>
            
            <div className="bg-graylight p-4 rounded-lg hover:bg-graylight/80 cursor-pointer transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                 onClick={() => navigate('/active-rides')}>
              <h3 className="font-medium mb-2">Active Rides</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monitor ongoing rentals</p>
            </div>
            
            <div className="bg-graylight p-4 rounded-lg hover:bg-graylight/80 cursor-pointer transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                 onClick={() => navigate('/available-bikes')}>
              <h3 className="font-medium mb-2">Available Bikes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check bike availability</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Bikes by Station</h2>
          
          <div className="flex items-center">
            <MapPin size={18} className="mr-1 text-graydark dark:text-gray-300" />
            <select
              value={selectedStation.id}
              onChange={(e) => setSelectedStation(stations.find(s => s.id === e.target.value) || stations[0])}
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.availableBikes} bikes)
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 max-h-[300px] overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mb-3">
              <Search size={16} />
              <Input placeholder="Search bikes..." className="text-sm" />
            </div>
            
            {stationBikes.length > 0 ? (
              <ul className="space-y-2">
                {stationBikes.map((bike) => (
                  <li key={bike.id} className="p-3 bg-graylight rounded-md hover:bg-graylight/80 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{bike.model}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {bike.id}</p>
                      </div>
                      {bike.category === 'scooter' ? (
                        <Car className="text-graydark dark:text-gray-300" size={20} />
                      ) : (
                        <BikeIcon className="text-graydark dark:text-gray-300" size={20} />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs">{bike.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${bike.status === 'available' ? 'bg-greenprimary/20 text-greenprimary dark:bg-greenprimary/40 dark:text-white' : 
                          bike.status === 'in-use' ? 'bg-greenaccent/30 text-graydark dark:bg-greenaccent/50 dark:text-white' : 
                          'bg-error/20 text-error dark:bg-error/50 dark:text-white'}`}
                      >
                        {bike.status.replace('-', ' ')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No bikes at this station
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 h-[300px] bg-graylight rounded-lg overflow-hidden dark:bg-gray-700">
            <StationMap 
              stations={stationLocations} 
              selectedStation={selectedStationId} 
              onStationSelect={handleStationSelect} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;
