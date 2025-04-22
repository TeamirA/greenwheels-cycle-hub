
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QRScannerMock from '@/components/ui/qr-scanner-mock';
import { bikes, reservations, stations, commonIssues } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Reservation as ReservationType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Bike, Check, Clock, Upload } from 'lucide-react';

const StaffPanel = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const [activeReservations, setActiveReservations] = useState<ReservationType[]>(
    reservations.filter(r => r.status === 'active' || r.status === 'overdue')
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  
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
    }
  };
  
  const handleCheckInOut = () => {
    toast({
      title: 'Success',
      description: 'Bike status updated successfully',
      variant: 'default',
    });
    setSelectedBikeId('');
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
          
          {selectedBikeId && (
            <div className="mt-4 p-4 border border-graylight rounded-md bg-graylight/30 animate-slide-up">
              <h3 className="font-medium text-graydark mb-2">Selected Bike: {selectedBikeId}</h3>
              <p className="text-sm text-graydark mb-4">
                {bikes.find(b => b.id === selectedBikeId)?.model} - {bikes.find(b => b.id === selectedBikeId)?.status.charAt(0).toUpperCase() + bikes.find(b => b.id === selectedBikeId)?.status.slice(1)}
              </p>
              <Button 
                className="w-full bg-greenprimary hover:bg-greenprimary/80 text-white"
                onClick={handleCheckInOut}
              >
                <Check size={18} className="mr-2" />
                {bikes.find(b => b.id === selectedBikeId)?.status === 'available' ? 'Check Out Bike' : 'Check In Bike'}
              </Button>
            </div>
          )}
        </div>
        
        {/* Reservations Section */}
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
          
          <div className="overflow-y-auto max-h-[400px]">
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
