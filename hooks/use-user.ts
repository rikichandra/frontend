import { useState, useEffect } from 'react';
import { userService, User, UserUpdateInput } from '@/services/user.service';
import { toast } from 'sonner';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching user data...');
      
      const response = await userService.getCurrentUser();
      console.log('Fetch user response:', response);
      
      if (response.status) {
        console.log('Setting user data:', response.data);
        setUser(response.data);
      } else {
        console.error('Fetch user failed:', response);
        setError(response.message || 'Failed to fetch user');
      }
    } catch (err: any) {
      console.error('Fetch user error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user';
      setError(errorMessage);
      console.error('Fetch user error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

export function useUserMutations() {
  const [loading, setLoading] = useState(false);

  const updateUser = async (userId: number, data: UserUpdateInput) => {
    try {
      setLoading(true);
      console.log('Sending user update request with userId:', userId, 'and data:', data);
      
      const response = await userService.updateUser(userId, data);
      console.log('User update response:', response);
      
      if (response.status) {
        toast.success(response.message || 'Profile updated successfully');
        return response.data;
      } else {
        console.error('Update failed with response:', response);
        toast.error(response.message || 'Failed to update profile');
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error('User update error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
  };
}