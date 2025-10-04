import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/services/category.service';
import { useCategories, useCategoryMutations } from '@/hooks/use-categories';
import { useDebounce } from '@/hooks/use-debounce';
import CategoryForm from './category-form';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function CategoryTable() {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.nama_kategori}"?`)) {
      try {
        await deleteCategory(category.id);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>
          Manage and organize your product categories
        </CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <CategoryForm onSuccess={onCategorySuccess} />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg mb-4">
            <p className="font-medium">Error loading categories</p>
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {debouncedSearch ? (
              <div>
                <p className="text-lg font-medium">No categories found</p>
                <p className="text-sm">No categories match "{debouncedSearch}"</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchInput('')} 
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">No categories yet</p>
                <p className="text-sm">Create your first category to get started!</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[180px]">Created</TableHead>
                    <TableHead className="w-[180px]">Updated</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.nama_kategori}
                      </TableCell>
                      <TableCell>
                        {category.deskripsi_kategori ? (
                          <span className="text-sm text-muted-foreground">
                            {category.deskripsi_kategori.length > 50
                              ? `${category.deskripsi_kategori.substring(0, 50)}...`
                              : category.deskripsi_kategori}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No description
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(category.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(category.updated_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  {pagination.from && pagination.to ? (
                    <>Showing {pagination.from} to {pagination.to} of {pagination.total} results</>
                  ) : (
                    <>Total {pagination.total} results</>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.prev_page_url || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = pagination.current_page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.current_page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.next_page_url || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Summary */}
            {!loading && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Page {pagination.current_page} of {pagination.last_page} • {pagination.per_page} per page
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}