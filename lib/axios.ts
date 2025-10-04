import axios from 'axios';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/',
  timeout: 10000,  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add ngrok header to all requests
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    // Get token from localStorage or your auth store
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('CORS Error: Check your backend CORS configuration');
      error.message = 'Unable to connect to server. Please check your internet connection or contact support.';
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-storage');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
    
    // Handle Laravel validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        error.message = Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
    
    return Promise.reject(error);
  }
);