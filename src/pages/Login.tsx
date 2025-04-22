
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bike } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the path the user was trying to access, or default to their role-appropriate dashboard
  const from = location.state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome to GreenWheels!',
          variant: 'default',
        });
        
        // Determine where to redirect based on user role
        let redirectPath = from;
        if (from === '/') {
          if (authState.role === 'admin') {
            redirectPath = '/admin-dashboard';
          } else if (authState.role === 'staff') {
            redirectPath = '/staff-panel';
          }
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-graylight p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <Bike size={40} className="text-greenprimary" />
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-graydark">Sign in to GreenWheels</h1>
          <p className="mt-2 text-sm text-graydark">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm bg-error/10 border border-error/30 text-error rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-input-animated" style={{ '--input-index': 0 } as React.CSSProperties}>
              <label htmlFor="email" className="block text-sm font-medium text-graydark mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full text-graydark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-input-animated" style={{ '--input-index': 1 } as React.CSSProperties}>
              <label htmlFor="password" className="block text-sm font-medium text-graydark mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full text-graydark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-input-animated" style={{ '--input-index': 2 } as React.CSSProperties}>
            <Button 
              type="submit"
              className="w-full bg-greenprimary hover:bg-greenprimary/80 text-white"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-graydark form-input-animated" 
           style={{ '--input-index': 3 } as React.CSSProperties}>
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-greenprimary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
