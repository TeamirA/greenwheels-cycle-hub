
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { UserPlus, X } from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

const RegisterUser = () => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToConfirm, setUserToConfirm] = useState<UserFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
  const onSubmit = (data: UserFormData) => {
    setUserToConfirm(data);
    setShowConfirmation(true);
  };
  
  const confirmRegister = () => {
    if (!userToConfirm) return;
    
    // In a real application, this would make an API call
    toast({
      title: 'User Registered',
      description: `${userToConfirm.name} has been registered as a ${userToConfirm.role}`,
    });
    
    setShowConfirmation(false);
    setUserToConfirm(null);
    reset();
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-graydark">Register New User</h1>
        <p className="text-muted-foreground">Create accounts for users and staff members</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
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
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              User Role
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full border border-input p-2 rounded-md focus:outline-none focus:ring-2"
            >
              <option value="user">Regular User</option>
              <option value="staff">Staff Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
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
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                validate: value => value === password || 'Passwords do not match'
              })}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            <UserPlus className="mr-2" size={18} />
            Register User
          </Button>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && userToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Registration</h2>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4">Are you sure you want to register the following user?</p>
            
            <div className="bg-graylight p-4 rounded-md mb-4">
              <p><span className="font-medium">Name:</span> {userToConfirm.name}</p>
              <p><span className="font-medium">Email:</span> {userToConfirm.email}</p>
              <p><span className="font-medium">Role:</span> {userToConfirm.role}</p>
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

export default RegisterUser;
