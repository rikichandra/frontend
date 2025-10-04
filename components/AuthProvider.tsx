'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
  } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on app load
    if (token && !user) {
      // Try to get user profile with existing token
      setLoading(true);
      authService.getProfile()
        .then((response) => {
          if (response.success) {
            // Map field names to match frontend structure
            const userData = {
              ...response.data,
              createdAt: response.data.created_at,
              updatedAt: response.data.updated_at,
            };
            storeLogin(userData, token, '');
          } else {
            storeLogout();
          }
        })
        .catch(() => {
          storeLogout();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, user, storeLogin, storeLogout, setLoading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.status) {
        // Store user data with proper field mapping
        const userData = {
          ...response.user,
          createdAt: response.user.created_at,
          updatedAt: response.user.updated_at,
        };
        
        storeLogin(userData, response.access_token, '');
        
        // Set cookie for middleware
        document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400; secure; samesite=strict`;
        
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    // Remove cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}