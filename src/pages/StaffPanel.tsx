
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QRScannerMock from '@/components/ui/qr-scanner-mock';
import { bikes, reservations, stations, commonIssues, users } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Reservation as ReservationType, Bike as BikeType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Bike, Check, Clock, Upload, ArrowRight, MapPin, Battery } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const StaffPanel = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeReservations, setActiveReservations] = useState<ReservationType[]>(
    reservations.filter(r => r.status === 'active' || r.status === 'overdue')
  );
  const [activeBikes, setActiveBikes] = useState<BikeType[]>(
    bikes.filter(b => b.status === 'in-use').slice(0, 5)
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [selectedBikeDetails, setSelectedBikeDetails] = useState<BikeType | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedActiveBike, setSelectedActiveBike] = useState<BikeType | null>(null);
  
  // Mock auto-refresh of reservations
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setRefreshing(true);
      
      // Simulate network delay
      setTimeout(() => {
        // For demo purposes, randomly change one reservation to overdue
        const updatedReservations = [...activeReservations];
        const randomIndex = Math.floor(Math.random() * updatedReservations.length);
        if (updatedReservations[randomIndex].status === 'active') {
          updatedReservations[randomIndex] = {
            ...updatedReservations[randomIndex],
            status: 'overdue'
          };
        }
        
        setActiveReservations(updatedReservations);
        setLastRefreshed(new Date());
        setRefreshing(false);
        
        toast({
          title: 'Reservations Updated',
          description: 'The reservation list has been refreshed',
          variant: 'default',
        });
      }, 1000);
    }, 120000); // Refresh every 2 minutes
    
    return () => clearInterval(refreshTimer);
  }, [activeReservations, toast]);
  
  const handleScan = (bikeId: string) => {
    const bike = bikes.find(b => b.id === bikeId);
    
    if (bike) {
      toast({
        title: 'Bike Scanned',
        description: `${bike.model} (${bikeId}) - Status: ${bike.status}`,
        variant: 'default',
      });
      setSelectedBikeId(bikeId);
      setSelectedBikeDetails(bike);
      
      // Select a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setSelectedUser(randomUser.name);
      
      // Hide any previously shown map
      setShowMap(false);
      setSelectedActiveBike(null);
    }
  };
  
  const handleStartRide = () => {
    if (!selectedBikeDetails) return;
    
    // Create a new active bike entry
    const updatedBike = { ...selectedBikeDetails, status: 'in-use' as BikeType['status'] };
    const updatedActiveBikes = [updatedBike, ...activeBikes.slice(0, 4)];
    
    setActiveBikes(updatedActiveBikes);
    
    toast({
      title: 'Ride Started',
      description: `Bike ${selectedBikeDetails.id} is now in use by ${selectedUser}`,
      variant: 'default',
    });
    
    // Reset selected bike
    setSelectedBikeId('');
    setSelectedBikeDetails(null);
    setSelectedUser(null);
  };
  
  const handleCheckInOut = () => {
    toast({
      title: 'Success',
      description: 'Bike status updated successfully',
      variant: 'default',
    });
    setSelectedBikeId('');
    setSelectedBikeDetails(null);
  };
  
  const handleActiveBikeClick = (bike: BikeType) => {
    setSelectedActiveBike(bike);
    setShowMap(true);
  };
  
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBikeId || !issueType) {
      toast({
        title: 'Error',
        description: 'Please select a bike and issue type',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Issue Reported',
      description: 'Maintenance team has been notified',
      variant: 'default',
    });
    
    setSelectedBikeId('');
    setIssueType('');
    setIssueDescription('');
    setFileUploaded(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileUploaded(true);
    toast({
      title: 'File Uploaded',
      description: 'Image uploaded successfully',
      variant: 'default',
    });
  };
  
  const handleClickUpload = () => {
    setFileUploaded(true);
    toast({
      title: 'File Uploaded',
      description: 'Image uploaded successfully',
      variant: 'default',
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-graydark">Station Staff Panel</h1>
        <p className="text-muted-foreground">
          Welcome, {authState.user?.name}! Manage bike rentals and report issues.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner Section */}
        <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-graydark mb-4">QR Scanner</h2>
          <QRScannerMock onScan={handleScan} className="mb-4" />
          
          {selectedBikeDetails ? (
            <div className="mt-4 p-4 border border-graylight rounded-md bg-graylight/30 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-graydark">Bike Details</h3>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  selectedBikeDetails.status === 'available' ? "bg-greenprimary/20 text-greenprimary" : 
                  selectedBikeDetails.status === 'in-use' ? "bg-greenaccent/30 text-graydark" : 
                  "bg-error/20 text-error"
                )}>
                  {selectedBikeDetails.status.charAt(0).toUpperCase() + selectedBikeDetails.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Bike ID</p>
                  <p className="font-medium">{selectedBikeDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{selectedBikeDetails.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Battery</p>
                  <p className="font-medium flex items-center">
                    <Battery size={14} className="mr-1" />
                    {selectedBikeDetails.batteryPercentage || 'N/A'}
                    {selectedBikeDetails.batteryPercentage && '%'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Station</p>
                  <p className="font-medium">
                    {stations.find(s => s.id === selectedBikeDetails.stationId)?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              
              {selectedBikeDetails.status === 'available' && selectedUser && (
                <div className="mb-4 p-3 bg-greenprimary/10 rounded border border-greenprimary/20">
                  <p className="text-sm text-gray-600 mb-1">Assign to User:</p>
                  <p className="font-medium text-graydark">{selectedUser}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                {selectedBikeDetails.status === 'available' && (
                  <Button 
                    className="flex-1 bg-greenprimary hover:bg-greenprimary/80 text-white"
                    onClick={handleStartRide}
                  >
                    <ArrowRight size={18} className="mr-2" />
                    Start Ride
                  </Button>
                )}
                
                {selectedBikeDetails.status === 'in-use' && (
                  <Button 
                    className="flex-1 bg-greenprimary hover:bg-greenprimary/80 text-white"
                    onClick={handleCheckInOut}
                  >
                    <Check size={18} className="mr-2" />
                    Check In Bike
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Active Bikes Section with Map */}
        <div className="bg-white rounded-lg shadow p-6 animate-fade-in overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-graydark">Active Bikes</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setRefreshing(true);
                  setTimeout(() => {
                    setLastRefreshed(new Date());
                    setRefreshing(false);
                  }, 1000);
                }}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          
          {showMap && selectedActiveBike ? (
            <div className="relative animate-fade-in">
              <div className="absolute top-2 right-2 z-10">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowMap(false);
                    setSelectedActiveBike(null);
                  }}
                >
                  Close Map
                </Button>
              </div>
              <div className="bg-graylight rounded-lg h-64 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-graylight/50 pointer-events-none" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-greenprimary/20 animate-pulse" />
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-greenprimary/40 animate-pulse" />
                    <div className="relative z-10 bg-greenprimary text-white p-3 rounded-full shadow-lg animate-bounce">
                      <Bike size={24} />
                    </div>
                    <p className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 font-medium text-sm bg-white px-2 py-1 rounded shadow">
                      {selectedActiveBike.id}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded text-xs">
                  Bike {selectedActiveBike.id} is currently in use
                </div>
              </div>
              <div className="p-3 bg-graylight/30 rounded-lg">
                <h3 className="font-medium mb-2">Bike Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Model:</p>
                    <p>{selectedActiveBike.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Battery:</p>
                    <p>{selectedActiveBike.batteryPercentage || 'N/A'}{selectedActiveBike.batteryPercentage && '%'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Maintenance:</p>
                    <p>{new Date(selectedActiveBike.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Rides:</p>
                    <p>{selectedActiveBike.totalRides}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[400px]">
              {activeBikes.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No active bikes</p>
              ) : (
                <ul className="space-y-3">
                  {activeBikes.map((bike) => (
                    <li 
                      key={bike.id}
                      className="p-4 border rounded-md transition-all border-graylight bg-white hover:bg-graylight/20 cursor-pointer"
                      onClick={() => handleActiveBikeClick(bike)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-graydark flex items-center">
                            <Bike size={16} className="mr-1" />
                            {bike.model} ({bike.id})
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            From: {stations.find(s => s.id === bike.stationId)?.name || 'Unknown'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium flex items-center text-greenprimary">
                            <Clock size={14} className="mr-1" />
                            In Use
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Battery: {bike.batteryPercentage || 'N/A'}{bike.batteryPercentage && '%'}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Reservations Section - Moved down */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-graydark">Active Reservations</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setRefreshing(true);
                setTimeout(() => {
                  setLastRefreshed(new Date());
                  setRefreshing(false);
                }, 1000);
              }}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[300px]">
          {activeReservations.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No active reservations</p>
          ) : (
            <ul className="space-y-3">
              {activeReservations.map((reservation) => (
                <li 
                  key={reservation.id}
                  className={cn(
                    "p-4 border rounded-md transition-all",
                    reservation.status === 'overdue' 
                      ? "border-error/50 bg-error/5" 
                      : "border-graylight bg-white hover:bg-graylight/20"
                  )}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium text-graydark flex items-center">
                        <Bike size={16} className="mr-1" />
                        {bikes.find(b => b.id === reservation.bikeId)?.model} ({reservation.bikeId})
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        From: {stations.find(s => s.id === reservation.stationId)?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-medium flex items-center",
                        reservation.status === 'overdue' ? "text-error" : "text-graydark"
                      )}>
                        <Clock size={14} className="mr-1" />
                        {reservation.status === 'overdue' ? 'OVERDUE' : 'Active'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Started: {new Date(reservation.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Issue Reporting Section */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-graydark mb-4">Report an Issue</h2>
        
        <form onSubmit={handleReportIssue} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bikeId" className="block text-sm font-medium text-graydark mb-1">
                Bike ID
              </label>
              <select
                id="bikeId"
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-graydark"
                required
              >
                <option value="">Select a bike</option>
                {bikes.map((bike) => (
                  <option key={bike.id} value={bike.id}>
                    {bike.id} - {bike.model}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-graydark mb-1">
                Issue Type
              </label>
              <select
                id="issueType"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-graydark"
                required
              >
                <option value="">Select issue type</option>
                {commonIssues.map((issue) => (
                  <option key={issue.id} value={issue.name}>
                    {issue.name} ({issue.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-graydark mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-graydark min-h-[100px]"
              placeholder="Provide details about the issue..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-graydark mb-1">
              Attach Photo (Optional)
            </label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
                fileUploaded ? "border-greenprimary bg-greenprimary/5" : "border-graylight hover:border-greenaccent"
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              {fileUploaded ? (
                <div className="flex flex-col items-center text-greenprimary">
                  <Check size={24} className="mb-2" />
                  <p className="text-sm font-medium">File uploaded successfully</p>
                  <p className="text-xs mt-1">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-graydark">
                  <Upload size={24} className="mb-2" />
                  <p className="text-sm font-medium">Drag and drop or click to upload</p>
                  <p className="text-xs mt-1">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-greenprimary hover:bg-greenprimary/80 text-white"
          >
            Submit Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StaffPanel;
