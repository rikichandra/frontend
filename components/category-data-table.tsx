"use client"

import { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Category } from '@/services/category.service';
import { useCategories, useCategoryMutations } from '@/hooks/use-categories';
import { useDebounce } from '@/hooks/use-debounce';
import CategoryForm from './category-form';
import { DataTable } from '@/components/data-table';
import { toast } from 'sonner';

export default function CategoryDataTable() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);

  const { categories, loading, error, pagination, refetch } = useCategories({
    s: debouncedSearch || undefined,
    page,
    per_page: perPage,
  });

  const { deleteCategory } = useCategoryMutations();

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

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.nama_kategori}"?`)) {
      try {
        await deleteCategory(category.id);
        toast.success('Category deleted successfully');
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

  const onCategorySuccess = () => {
    refetch({
      s: debouncedSearch || undefined,
      page,
      per_page: perPage,
    });
  };

  // Define columns for the data table
  const columns: ColumnDef<Category>[] = useMemo(() => [
    {
      accessorKey: "nama_kategori",
      header: "Name",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="font-medium">
            {category.nama_kategori}
          </div>
        );
      },
    },
    {
      accessorKey: "deskripsi_kategori",
      header: "Description",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {category.deskripsi_kategori ? (
              category.deskripsi_kategori.length > 50
                ? `${category.deskripsi_kategori.substring(0, 50)}...`
                : category.deskripsi_kategori
            ) : (
              <span className="italic">No description</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(category.created_at)}
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(category.updated_at)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <CategoryForm
                category={category}
                onSuccess={onCategorySuccess}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem 
                onClick={() => handleDelete(category)}
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
  ], [onCategorySuccess, handleDelete, formatDate]);

  return (
    <DataTable
      columns={columns}
      data={categories}
      loading={loading}
      error={error}
      // Search
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="Search categories..."
      // Pagination
      pagination={pagination}
      onPageChange={handlePageChange}
      // Header
      title="Product Categories"
      description="Manage and organize your product categories"
      // Actions
      headerActions={<CategoryForm onSuccess={onCategorySuccess} />}
      // Empty state
      emptyMessage={debouncedSearch ? "No categories found" : "No categories yet"}
      emptyDescription={
        debouncedSearch 
          ? `No categories match "${debouncedSearch}"` 
          : "Create your first category to get started!"
      }
      // Loading skeleton
      skeletonRows={perPage}
    />
  );
}