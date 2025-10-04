import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">
            Organize your products with categories
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>
            Manage and organize your product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Category management interface will be implemented here.</p>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Example category cards */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Electronics</h3>
                <p className="text-sm text-muted-foreground">25 products</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Clothing</h3>
                <p className="text-sm text-muted-foreground">18 products</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Books</h3>
                <p className="text-sm text-muted-foreground">32 products</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Home & Garden</h3>
                <p className="text-sm text-muted-foreground">15 products</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}