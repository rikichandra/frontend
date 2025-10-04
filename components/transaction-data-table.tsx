import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table-new';
import { useTransactions, useTransactionMutations } from '@/hooks/use-transactions';
import { Transaction } from '@/services/transaction.service'; // Use service Transaction type
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Package, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionDataTableProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  refreshTrigger?: number; // Add refresh trigger prop
  onTransactionDeleted?: () => void; // Add callback for when transaction is deleted
}

export default function TransactionDataTable({ searchValue, onSearchChange, refreshTrigger, onTransactionDeleted }: TransactionDataTableProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [lastRefreshTrigger, setLastRefreshTrigger] = useState<number>(0);
  const [renderKey, setRenderKey] = useState(0); // Add render key for forced updates

  const { transactions, loading, error, pagination, refetch, updateCounter } = useTransactions({
    page,
    per_page: perPage,
    s: searchValue, // Changed from search to s
  });

  console.log('TransactionDataTable render - transactions:', transactions.length, 'loading:', loading, 'refreshTrigger:', refreshTrigger, 'updateCounter:', updateCounter);

  // Auto refresh when refreshTrigger changes, but prevent duplicate calls
  useEffect(() => {
    if (refreshTrigger && refreshTrigger !== lastRefreshTrigger) {
      console.log('refreshTrigger changed from', lastRefreshTrigger, 'to', refreshTrigger);
      setLastRefreshTrigger(refreshTrigger);
      // Add small delay to prevent race conditions
      const timeoutId = setTimeout(() => {
        refetch(undefined, true).then(() => {
          console.log('Refresh completed, forcing render update');
          setRenderKey(prev => prev + 1); // Force component re-render
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [refreshTrigger, lastRefreshTrigger]); // Remove refetch from dependencies

  const { deleteTransaction, loading: deleteLoading } = useTransactionMutations();

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        // Force refresh local data
        await refetch(undefined, true);
        // Notify parent component
        onTransactionDeleted?.();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const getTransactionBadge = (type: string) => {
    const isStockIn = type === 'in';
    return (
      <Badge 
        variant={isStockIn ? 'default' : 'destructive'}
        className={isStockIn ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
      >
        <div className="flex items-center space-x-1">
          {isStockIn ? <Package className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
          <span>{isStockIn ? 'Stock In' : 'Stock Out'}</span>
        </div>
      </Badge>
    );
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          TXN-{String(row.getValue('id')).padStart(4, '0')}
        </div>
      ),
    },
    {
      accessorKey: 'jenis_transaksi',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('jenis_transaksi') as string;
        return getTransactionBadge(type);
      },
    },
    {
      accessorKey: 'detail_transaksis',
      header: 'Products',
      cell: ({ row }) => {
        const details = row.getValue('detail_transaksis') as any[];
        
        // Defensive check for details
        if (!details || !Array.isArray(details) || details.length === 0) {
          return (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">No products</div>
              <div className="text-xs text-muted-foreground">-</div>
            </div>
          );
        }
        
        const totalProducts = details.length;
        const totalQuantity = details.reduce((sum, detail) => sum + (detail.jumlah_produk || 0), 0);
        
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {totalProducts} product{totalProducts !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              Total qty: {totalQuantity}
            </div>
            {totalProducts <= 2 && (
              <div className="text-xs text-muted-foreground">
                {details.map((detail, idx) => (
                  <div key={idx}>{detail.produk?.nama_produk || 'Unknown'}</div>
                ))}
              </div>
            )}
            {totalProducts > 2 && (
              <div className="text-xs text-muted-foreground">
                {details[0].produk?.nama_produk || 'Unknown'} +{totalProducts - 1} more
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const user = row.getValue('user') as any;
        const fullName = user ? `${user.nama_depan} ${user.nama_belakang}`.trim() : 'Unknown';
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{fullName}</div>
            <div className="text-xs text-muted-foreground">{user?.email || '-'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {format(new Date(date), 'MMM dd, yyyy')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(date), 'HH:mm:ss')}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetail(transaction)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(transaction.id)}
                className="text-red-600"
                disabled={deleteLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        key={`transactions-${refreshTrigger}-${transactions.length}-${renderKey}-${updateCounter}`}
        columns={columns}
        data={transactions}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search transactions..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Transaction Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Transaction Details</span>
              {selectedTransaction && getTransactionBadge(selectedTransaction.jenis_transaksi)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Transaction ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono">TXN-{String(selectedTransaction.id).padStart(4, '0')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{format(new Date(selectedTransaction.created_at), 'PPpp')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {selectedTransaction.user ? 
                        `${selectedTransaction.user.nama_depan} ${selectedTransaction.user.nama_belakang}`.trim() : 
                        'Unknown'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedTransaction.user?.email || '-'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {selectedTransaction.detail_transaksis?.reduce((sum, detail) => sum + (detail.jumlah_produk || 0), 0) || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTransaction.detail_transaksis && Array.isArray(selectedTransaction.detail_transaksis) && selectedTransaction.detail_transaksis.length > 0 ? (
                      selectedTransaction.detail_transaksis.map((detail: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {/* Product Image */}
                            {detail.produk?.gambar_produk_url && (
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={detail.produk.gambar_produk_url} 
                                  alt={detail.produk.nama_produk}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{detail.produk?.nama_produk || 'Unknown Product'}</p>
                              <p className="text-sm text-muted-foreground">
                                Product ID: {detail.produk?.id || detail.produk_id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Current Stock: {detail.produk?.stok_produk || '-'}
                              </p>
                              {detail.produk?.deskripsi_produk && (
                                <p className="text-xs text-muted-foreground truncate max-w-xs">
                                  {detail.produk.deskripsi_produk}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">
                              <span className={selectedTransaction.jenis_transaksi === 'in' ? 'text-green-600' : 'text-red-600'}>
                                {selectedTransaction.jenis_transaksi === 'in' ? '+' : '-'}{detail.jumlah_produk || 0}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedTransaction.jenis_transaksi === 'in' ? 'Added to' : 'Removed from'} stock
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        No product information available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Notes */}
              {selectedTransaction.catatan_transaksi && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Transaction Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      {selectedTransaction.catatan_transaksi}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}