import { useState, useEffect } from 'react';
import { productService, Product, ProductFilters } from '@/services/product.service';
import { ProductInput } from '@/lib/validators';
import { toast } from 'sonner';
import { useDebounce } from './use-debounce';

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
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

  const fetchProducts = async (newFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const finalFilters = { ...filters, ...newFilters };
      const response = await productService.getProducts(finalFilters);
      
      if (response.status) {
        setProducts(response.data.data);
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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  };
}

export function useProduct(id?: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(id);
      
      if (response.status) {
        setProduct(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

export function useProductMutations() {
  const [loading, setLoading] = useState(false);

  const createProduct = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await productService.createProduct(data);
      
      if (response.status) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, data: FormData) => {
    try {
      setLoading(true);
      const response = await productService.updateProduct(id, data);
      
      if (response.status) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update product';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      const response = await productService.deleteProduct(id);
      
      if (response.status) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete product';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  };
}