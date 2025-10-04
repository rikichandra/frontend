import { useState, useEffect } from 'react';
import { transactionService, Transaction, TransactionFilters } from '@/services/transaction.service';
import { TransactionInput } from '@/lib/validators';
import { toast } from 'sonner';

export interface TransactionPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchKey, setLastFetchKey] = useState<string>('');
  const [updateCounter, setUpdateCounter] = useState(0); // Add counter to force updates
  const [pagination, setPagination] = useState<TransactionPagination>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
    next_page_url: null,
    prev_page_url: null,
  });

  const fetchTransactions = async (newFilters?: TransactionFilters, forceRefresh = false) => {
    const finalFilters = { ...filters, ...newFilters };
    // Add timestamp to force refresh when needed
    const fetchKey = forceRefresh 
      ? JSON.stringify(finalFilters) + '_' + Date.now()
      : JSON.stringify(finalFilters);
    
    // Only skip duplicate calls if not forcing refresh and no new filters
    if (!forceRefresh && fetchKey === lastFetchKey && !newFilters) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setLastFetchKey(fetchKey);
      
      console.log('Fetching transactions with filters:', finalFilters, 'forceRefresh:', forceRefresh);
      const response = await transactionService.getTransactions(finalFilters);
      
      if (response.status) {
        const paginationData = response.data;
        const transactionData = Array.isArray(paginationData.data) ? paginationData.data : [];
        console.log('Setting transactions data:', transactionData.length, 'items');
        setTransactions(transactionData);
        setUpdateCounter(prev => prev + 1); // Force component updates
        
        // Map Laravel pagination to our pagination interface
        setPagination({
          current_page: paginationData.current_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
          last_page: paginationData.last_page,
          from: paginationData.from,
          to: paginationData.to,
          next_page_url: paginationData.next_page_url,
          prev_page_url: paginationData.prev_page_url,
        });
      } else {
        setError('Failed to fetch transactions');
        setTransactions([]); // Set empty array on error
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch transactions';
      setError(errorMessage);
      setTransactions([]); // Set empty array on error
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    
    const debounceTimer = setTimeout(() => {
      if (!isCancelled) {
        fetchTransactions();
      }
    }, 300); // Reduced debounce time for better responsiveness

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [JSON.stringify(filters)]); // Use JSON.stringify to properly detect filter changes

  const refetch = async (newFilters?: TransactionFilters, forceRefresh = true) => {
    console.log('refetch called with:', { newFilters, forceRefresh });
    return fetchTransactions(newFilters, forceRefresh);
  };

  return {
    transactions,
    loading,
    error,
    pagination,
    refetch,
    updateCounter, // Expose update counter for key generation
  };
}

export function useTransactionMutations() {
  const [loading, setLoading] = useState(false);

  const createTransaction = async (data: TransactionInput) => {
    try {
      setLoading(true);
      const response = await transactionService.createTransaction(data);
      
      if (response.status) {
        toast.success(response.message || 'Transaction created successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Failed to create transaction');
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create transaction';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      setLoading(true);
      const response = await transactionService.deleteTransaction(id);
      
      if (response.status) {
        toast.success(response.message || 'Transaction deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete transaction');
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete transaction';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTransaction,
    deleteTransaction,
    loading,
  };
}