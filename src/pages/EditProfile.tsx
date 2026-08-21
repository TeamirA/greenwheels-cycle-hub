import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { API_BASE_URL } from "@/lib/config";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [userId, setUserId] = useState<number | string | null>(authState.user?.id ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the logged-in user's own profile data. authState.user is not
    // populated for staff/admin/maintenance logins (the backend's /api/login
    // response has no `user` field), so the id used for the save call below
    // comes from this response instead of authState.user?.id.
    fetch(`${API_BASE_URL}/api/user/info`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authState.token}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await res.json();
        const user = data.user || {};
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
        });
        if (user.id) {
          setUserId(user.id);
        }
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: 'Error',
        description: 'Could not determine your account id. Please reload the page and try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/update-profile/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'default',
      });
      navigate(-1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-graylight p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-graydark dark:text-white">
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-greenprimary hover:bg-greenprimary/80 text-white"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile; 