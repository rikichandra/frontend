"use client"

import { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, Package, Eye } from 'lucide-react';
import { Product } from '@/services/product.service';
import { useProducts, useProductMutations } from '@/hooks/use-products';
import { useDebounce } from '@/hooks/use-debounce';
import ProductForm from './product-form';
import { DataTable } from '@/components/data-table';
import { toast } from 'sonner';

export default function ProductDataTable() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);

  const { products, loading, error, pagination, refetch } = useProducts({
    s: debouncedSearch || undefined,
    page,
    per_page: perPage,
  });

  const { deleteProduct } = useProductMutations();

  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearch !== searchInput) {
      setPage(1);
    }
  }, [debouncedSearch]);

  // Refetch when debounced search or page changes
  useEffect(() => {
    refetch({
      s: debouncedSearch || undefined,
      page,
      per_page: perPage,
    });
  }, [debouncedSearch, page]);

  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.nama_produk}"?`)) {
      try {
        await deleteProduct(product.id);
        toast.success('Product deleted successfully');
        // Refetch current page
        refetch({
          s: debouncedSearch || undefined,
          page,
          per_page: perPage,
        });
      } catch (error) {
        // Error handled in mutation hook
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="secondary">Low Stock ({stock})</Badge>;
    } else {
      return <Badge variant="default">In Stock ({stock})</Badge>;
    }
  };

  const onProductSuccess = () => {
    refetch({
      s: debouncedSearch || undefined,
      page,
      per_page: perPage,
    });
  };

  // Define columns for the data table
  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      accessorKey: "nama_produk",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center space-x-3">
            {product.gambar_produk ? (
              <img
                src={`/storage/${product.gambar_produk}`}
                alt={product.nama_produk}
                className="w-10 h-10 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center">
                <Package className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div>
              <div className="font-medium">{product.nama_produk}</div>
              <div className="text-sm text-muted-foreground">
                {product.kategori_produk.nama_kategori}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "deskripsi_produk",
      header: "Description",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-muted-foreground max-w-xs">
            {product.deskripsi_produk ? (
              product.deskripsi_produk.length > 50
                ? `${product.deskripsi_produk.substring(0, 50)}...`
                : product.deskripsi_produk
            ) : (
              <span className="italic">No description</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "stok_produk",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-center">
            {getStockBadge(product.stok_produk)}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(product.created_at)}
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(product.updated_at)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View product', product.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <ProductForm
                product={product}
                onSuccess={onProductSuccess}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem 
                onClick={() => handleDelete(product)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [onProductSuccess, handleDelete, formatDate, getStockBadge]);

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      error={error}
      // Search
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="Search products..."
      // Pagination
      pagination={pagination}
      onPageChange={handlePageChange}
      // Header
      title="Product Inventory"
      description="Manage your product inventory and details"
      // Actions
      headerActions={<ProductForm onSuccess={onProductSuccess} />}
      // Empty state
      emptyMessage={debouncedSearch ? "No products found" : "No products yet"}
      emptyDescription={
        debouncedSearch 
          ? `No products match "${debouncedSearch}"` 
          : "Create your first product to get started!"
      }
      // Loading skeleton
      skeletonRows={perPage}
    />
  );
}