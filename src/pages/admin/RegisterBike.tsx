
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BikeCategory, BikeStatus } from '@/types';
import { Bike, Plus, X } from 'lucide-react';
import { stations } from '@/data/mockData';

interface BikeFormData {
  model: string;
  category: BikeCategory;
  stationId: string;
  status: BikeStatus;
}

const RegisterBike = () => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bikeToConfirm, setBikeToConfirm] = useState<BikeFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BikeFormData>({
    defaultValues: {
      model: '',
      category: 'regular',
      stationId: stations[0]?.id || '',
      status: 'available'
    }
  });
  
  const onSubmit = (data: BikeFormData) => {
    setBikeToConfirm(data);
    setShowConfirmation(true);
  };
  
  const confirmRegister = () => {
    if (!bikeToConfirm) return;
    
    // In a real application, this would make an API call
    toast({
      title: 'Bike Registered',
      description: `A new ${bikeToConfirm.model} has been added to the fleet`,
    });
    
    setShowConfirmation(false);
    setBikeToConfirm(null);
    reset();
  };
  
  // Get station name by ID
  const getStationName = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : 'Unknown Station';
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-graydark">Register New Bike</h1>
        <p className="text-muted-foreground">Add new bikes to the GreenWheels fleet</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="model">
              Bike Model
            </label>
            <Input
              id="model"
              {...register('model', { required: 'Bike model is required' })}
              placeholder="City Cruiser"
            />
            {errors.model && (
              <p className="text-error text-sm mt-1">{errors.model.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full border border-input p-2 rounded-md focus:outline-none focus:ring-2"
            >
              <option value="regular">Regular Bike</option>
              <option value="electric">Electric Bike</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="stationId">
              Station
            </label>
            <select
              id="stationId"
              {...register('stationId', { required: 'Station is required' })}
              className="w-full border border-input p-2 rounded-md focus:outline-none focus:ring-2"
            >
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.location})
                </option>
              ))}
            </select>
            {errors.stationId && (
              <p className="text-error text-sm mt-1">{errors.stationId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Initial Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full border border-input p-2 rounded-md focus:outline-none focus:ring-2"
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance Required</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full">
            <Bike className="mr-2" size={18} />
            Register Bike
          </Button>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && bikeToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Bike Registration</h2>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4">Are you sure you want to register the following bike?</p>
            
            <div className="bg-graylight p-4 rounded-md mb-4">
              <p><span className="font-medium">Model:</span> {bikeToConfirm.model}</p>
              <p><span className="font-medium">Category:</span> {bikeToConfirm.category}</p>
              <p><span className="font-medium">Station:</span> {getStationName(bikeToConfirm.stationId)}</p>
              <p><span className="font-medium">Status:</span> {bikeToConfirm.status}</p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button onClick={confirmRegister}>
                Confirm Registration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterBike;
