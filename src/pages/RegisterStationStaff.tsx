
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserRole, User } from '@/types';
import { UserPlus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { stations } from '@/data/mockData';

interface StaffFormData {
  name: string;
  email: string;
  role: 'staff' | 'maintenance';
  password: string;
  confirmPassword: string;
}

const RegisterStationStaff = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [staffToConfirm, setStaffToConfirm] = useState<StaffFormData | null>(null);
  
  // Assuming the station admin is assigned to a station (in a real app)
  const adminStationId = authState.user?.stationId || stations[0].id;
  const stationName = stations.find(s => s.id === adminStationId)?.name || 'Unknown Station';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'staff',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
  const onSubmit = (data: StaffFormData) => {
    setStaffToConfirm(data);
    setShowConfirmation(true);
  };
  
  const confirmRegister = () => {
    if (!staffToConfirm) return;
    
    // In a real application, this would make an API call
    toast({
      title: 'Staff Registered',
      description: `${staffToConfirm.name} has been registered as a ${staffToConfirm.role} for ${stationName}`,
    });
    
    setShowConfirmation(false);
    setStaffToConfirm(null);
    reset();
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Register Station Staff</h1>
        <p className="text-muted-foreground dark:text-gray-400">Create accounts for staff and maintenance team members for {stationName}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="John Doe"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="john@example.com"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300" htmlFor="role">
              Staff Role
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full border border-input p-2 rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="staff">Regular Staff</option>
              <option value="maintenance">Maintenance Team</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              placeholder="••••••••"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                validate: value => value === password || 'Passwords do not match'
              })}
              placeholder="••••••••"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            <UserPlus className="mr-2" size={18} />
            Register Staff
          </Button>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && staffToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Confirm Registration</h2>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4 dark:text-gray-300">Are you sure you want to register the following staff member for {stationName}?</p>
            
            <div className="bg-graylight dark:bg-gray-700 p-4 rounded-md mb-4">
              <p className="dark:text-white"><span className="font-medium">Name:</span> {staffToConfirm.name}</p>
              <p className="dark:text-white"><span className="font-medium">Email:</span> {staffToConfirm.email}</p>
              <p className="dark:text-white"><span className="font-medium">Role:</span> {staffToConfirm.role}</p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
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

export default RegisterStationStaff;
