import { useState, useEffect } from 'react';
import { categoryService, Category, CategoryFilters } from '@/services/category.service';
import { CategoryInput } from '@/lib/validators';
import { toast } from 'sonner';
import { useDebounce } from './use-debounce';

export function useCategories(filters: CategoryFilters = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: null as number | null,
    to: null as number | null,
    next_page_url: null as string | null,
    prev_page_url: null as string | null,
  });

  const fetchCategories = async (newFilters?: CategoryFilters) => {
    try {
      setLoading(true);
      setError(null);
      const finalFilters = { ...filters, ...newFilters };
      const response = await categoryService.getCategories(finalFilters);
      
      if (response.status) {
        setCategories(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total: response.data.total,
          last_page: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          next_page_url: response.data.next_page_url,
          prev_page_url: response.data.prev_page_url,
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    pagination,
    refetch: fetchCategories,
  };
}

export function useCategory(id?: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategoryById(id);
      
      if (response.status) {
        setCategory(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch category');
      toast.error('Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false);

  const createCategory = async (data: CategoryInput) => {
    try {
      setLoading(true);
      const response = await categoryService.createCategory(data);
      
      if (response.status) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, data: Partial<CategoryInput>) => {
    try {
      setLoading(true);
      const response = await categoryService.updateCategory(id, data);
      
      if (response.status) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      const response = await categoryService.deleteCategory(id);
      
      if (response.status) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  };
}