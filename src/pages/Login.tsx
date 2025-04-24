
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bike, UserCheck, ShieldAlert, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        
        // Role-based redirect
        if (authState.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (authState.role === 'staff') {
          navigate('/staff-panel');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password');
        toast({
          title: 'Login failed',
          description: 'Please check your credentials',
          variant: 'destructive',
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Demo account credentials
  const demoAccounts = [
    { role: 'Admin', email: 'admin@gmail.com', password: 'password', icon: ShieldAlert },
    { role: 'Staff', email: 'staff@gmail.com', password: 'password', icon: UserCheck },
    { role: 'User', email: 'michael.brown@example.com', password: 'password', icon: User },
    { role: 'User', email: 'emily.davis@example.com', password: 'password', icon: User }
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-graylight p-4 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg animate-fade-in dark:bg-gray-800">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <Bike size={40} className="text-greenprimary" />
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-graydark dark:text-white">Sign in to GreenWheels</h1>
          <p className="mt-2 text-sm text-graydark dark:text-gray-300">
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
              <label htmlFor="email" className="block text-sm font-medium text-graydark mb-1 dark:text-gray-300">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full text-graydark dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-input-animated" style={{ '--input-index': 1 } as React.CSSProperties}>
              <label htmlFor="password" className="block text-sm font-medium text-graydark mb-1 dark:text-gray-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full text-graydark dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

        <div className="mt-6">
          <Separator className="mb-4" />
          <h3 className="text-sm font-medium text-center text-graydark mb-3 dark:text-gray-300">Demo Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoAccounts.map((account, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-700 border-none shadow-sm overflow-hidden">
                <CardHeader className="py-2 px-3 bg-gray-100 dark:bg-gray-600 flex flex-row items-center">
                  <account.icon className="h-4 w-4 mr-2 text-graydark dark:text-gray-300" />
                  <CardTitle className="text-sm font-medium">{account.role}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Email:</span> <span className="font-mono font-medium text-graydark dark:text-gray-300">{account.email}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Password:</span> <span className="font-mono font-medium text-graydark dark:text-gray-300">{account.password}</span>
                  </p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full mt-2 text-xs h-7 text-greenprimary hover:text-greenprimary/80 hover:bg-greenprimary/10"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                  >
                    Use This Account
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
