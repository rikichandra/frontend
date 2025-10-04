import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useUserMutations } from '@/hooks/use-user';
import { UserUpdateInput } from '@/services/user.service';
import { Save, User, Mail, Calendar, Users, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfileForm() {
  const { user, loading: userLoading, refetch } = useUser();
  const { updateUser, loading: updateLoading } = useUserMutations();
  
  const [formData, setFormData] = useState<UserUpdateInput>({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    tanggal_lahir: '',
    jenis_kelamin: undefined,
    password: '',
    password_confirmation: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      console.log('Populating form with user data:', user);
      setFormData(prev => ({
        ...prev,
        nama_depan: user.nama_depan || '',
        nama_belakang: user.nama_belakang || '',
        email: user.email || '',
        tanggal_lahir: user.tanggal_lahir ? user.tanggal_lahir.split('T')[0] : '',
        jenis_kelamin: user.jenis_kelamin || undefined,
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Only validate fields that have values (since backend doesn't require them)
    if (formData.nama_depan && formData.nama_depan.length > 255) {
      newErrors.nama_depan = 'First name must not exceed 255 characters';
    }
    
    if (formData.nama_belakang && formData.nama_belakang.length > 255) {
      newErrors.nama_belakang = 'Last name must not exceed 255 characters';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed, errors:', errors);
      return;
    }

    try {
      // Only send fields that have values (excluding empty strings and passwords if not changed)
      const updateData: UserUpdateInput = {};
      
      if (formData.nama_depan?.trim()) updateData.nama_depan = formData.nama_depan.trim();
      if (formData.nama_belakang?.trim()) updateData.nama_belakang = formData.nama_belakang.trim();
      if (formData.email?.trim()) updateData.email = formData.email.trim();
      if (formData.tanggal_lahir?.trim()) updateData.tanggal_lahir = formData.tanggal_lahir.trim();
      if (formData.jenis_kelamin) updateData.jenis_kelamin = formData.jenis_kelamin;
      
      // Only include password if it's being changed
      if (formData.password?.trim()) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }
      
      console.log('Form submit - prepared update data:', updateData);
      
      if (Object.keys(updateData).length === 0) {
        toast.error('No changes to save');
        return;
      }

      // Ensure we have user ID before attempting update
      if (!user?.id) {
        toast.error('User ID not available. Please refresh and try again.');
        return;
      }

      const updatedUser = await updateUser(user.id, updateData);
      console.log('Update successful, received user data:', updatedUser);
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
      
      // Refresh user data to get latest from server
      setTimeout(() => {
        refetch();
      }, 500);
      
    } catch (error) {
      console.error('Update profile failed:', error);
    }
  };

  const handleInputChange = (field: keyof UserUpdateInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (userLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Settings</span>
          </CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and account settings
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={userLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${userLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama_depan">First Name</Label>
                <Input
                  id="nama_depan"
                  type="text"
                  value={formData.nama_depan}
                  onChange={(e) => handleInputChange('nama_depan', e.target.value)}
                  placeholder="Enter your first name"
                />
                {errors.nama_depan && (
                  <p className="text-sm text-red-600">{errors.nama_depan}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama_belakang">Last Name</Label>
                <Input
                  id="nama_belakang"
                  type="text"
                  value={formData.nama_belakang}
                  onChange={(e) => handleInputChange('nama_belakang', e.target.value)}
                  placeholder="Enter your last name"
                />
                {errors.nama_belakang && (
                  <p className="text-sm text-red-600">{errors.nama_belakang}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date of Birth</span>
                </Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin">Gender</Label>
                <Select
                  value={formData.jenis_kelamin}
                  onValueChange={(value: 'Laki-laki' | 'Perempuan') => 
                    handleInputChange('jenis_kelamin', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Security Settings</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Leave password fields empty if you don't want to change your password
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              type="submit" 
              disabled={updateLoading}
              className="min-w-[120px]"
            >
              {updateLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}