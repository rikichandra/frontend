'use client';

import CategoryDataTable from '@/components/category-data-table';

export default function CategoriesPage() {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <p className="text-muted-foreground">
          Organize your products with categories
        </p>
      </div>
      <CategoryDataTable />
    </div>
  );
}