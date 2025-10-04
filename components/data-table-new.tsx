"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Settings2, ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  error?: string | null
  // Search functionality
  searchKey?: keyof TData
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  // Pagination
  pagination?: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number | null
    to: number | null
    next_page_url: string | null
    prev_page_url: string | null
  }
  onPageChange?: (page: number) => void
  // Header
  title?: string
  description?: string
  // Actions
  headerActions?: React.ReactNode
  // Empty state
  emptyMessage?: string
  emptyDescription?: string
  // Loading rows count for skeleton
  skeletonRows?: number
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  loading = false,
  error = null,
  searchKey,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  pagination,
  onPageChange,
  title,
  description,
  headerActions,
  emptyMessage = "No results found",
  emptyDescription,
  skeletonRows = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  // Defensive check for columns
  const safeColumns = React.useMemo(() => {
    return columns || []
  }, [columns])

  // Defensive check for data
  const safeData = React.useMemo(() => {
    return data || []
  }, [data])

  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    onSearchChange?.(value)
    
    // Also filter the table locally if searchKey is provided
    if (searchKey) {
      table.getColumn(searchKey as string)?.setFilterValue(value)
    }
  }

  const handlePageChange = (page: number) => {
    onPageChange?.(page)
  }

  const TableSkeleton = () => (
    <>
      {Array.from({ length: skeletonRows }).map((_, index) => (
        <TableRow key={index}>
          {safeColumns.length > 0 ? (
            safeColumns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))
          ) : (
            // Fallback skeleton with 4 columns if no columns defined
            Array.from({ length: 4 }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))
          )}
        </TableRow>
      ))}
    </>
  )

  const TableContent = () => {
    if (loading) {
      return <TableSkeleton />
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={safeColumns.length || 4} className="h-24 text-center">
            <div className="text-red-500">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (table.getRowModel().rows?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={safeColumns.length || 4} className="h-24 text-center">
            <div className="text-muted-foreground">
              <p className="font-medium">{emptyMessage}</p>
              {emptyDescription && (
                <p className="text-sm">{emptyDescription}</p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  const PaginationControls = () => {
    if (!pagination || pagination.last_page <= 1) return null

    return (
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
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={!pagination.prev_page_url || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
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
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={!pagination.next_page_url || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Search */}
              {onSearchChange && (
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
              )}
              
              {/* Column visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Settings2 className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Header actions */}
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableContent />
            </TableBody>
          </Table>
        </div>

        <PaginationControls />

        {/* Summary */}
        {pagination && !loading && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Page {pagination.current_page} of {pagination.last_page} • {pagination.per_page} per page
          </div>
        )}
      </CardContent>
    </Card>
  )
}