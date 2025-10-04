'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';

interface UseFetchOptions {
  immediate?: boolean;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T = any>(
  url: string, 
  options: UseFetchOptions = { immediate: true }
) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await apiClient.get<T>(url);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  };

  const refetch = () => {
    execute();
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [url, options.immediate]);

  return {
    ...state,
    refetch,
    execute,
  };
}