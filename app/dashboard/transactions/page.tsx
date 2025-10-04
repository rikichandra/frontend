'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, TrendingUp, TrendingDown, Package, Activity } from 'lucide-react';
import TransactionForm from '@/components/transaction-form'; // Multi-product transaction form
import TransactionDataTable from '@/components/transaction-data-table';
import { useTransactions } from '@/hooks/use-transactions';

export default function TransactionsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { transactions, loading, pagination, refetch, updateCounter } = useTransactions({
    s: searchValue, // Changed from search to s
    page,
    per_page: 10,
  });

  // Add logging to monitor transaction changes
  useEffect(() => {
    console.log('Transactions data updated:', transactions.length, 'items', 'updateCounter:', updateCounter);
  }, [transactions, updateCounter]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1); // Reset to first page when searching
  };

  const handleRefresh = async () => {
    console.log('handleRefresh called, isRefreshing:', isRefreshing);
    if (isRefreshing) return; // Prevent multiple concurrent refreshes
    
    setIsRefreshing(true);
    try {
      console.log('Starting refresh with filters:', { s: searchValue, page, per_page: 10 });
      // Force refresh with current filters
      await refetch({
        s: searchValue,
        page,
        per_page: 10,
      }, true);
      setRefreshKey(prev => prev + 1);
      console.log('Refresh completed, new refreshKey:', refreshKey + 1);
    } finally {
      // Reset refreshing state after a short delay
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleTransactionSuccess = () => {
    console.log('handleTransactionSuccess called, isRefreshing:', isRefreshing);
    // Only trigger refresh if not already refreshing
    if (!isRefreshing) {
      handleRefresh();
    }
  };

  // Calculate statistics with defensive checks for multi-product structure
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const stockInTransactions = safeTransactions.filter(t => t.jenis_transaksi === 'in');
  const stockOutTransactions = safeTransactions.filter(t => t.jenis_transaksi === 'out');
  
  const totalStockIn = stockInTransactions.reduce((sum, t) => {
    if (!t.detail_transaksis || !Array.isArray(t.detail_transaksis)) return sum;
    return sum + t.detail_transaksis.reduce((detailSum, detail) => detailSum + (detail.jumlah_produk || 0), 0);
  }, 0);
  
  const totalStockOut = stockOutTransactions.reduce((sum, t) => {
    if (!t.detail_transaksis || !Array.isArray(t.detail_transaksis)) return sum;
    return sum + t.detail_transaksis.reduce((detailSum, detail) => detailSum + (detail.jumlah_produk || 0), 0);
  }, 0);

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage stock in and stock out transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            <Activity className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <TransactionForm
            onSuccess={handleTransactionSuccess}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            }
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">
              All transaction records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockInTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              +{totalStockIn} items added
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockOutTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              -{totalStockOut} items removed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Stock</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalStockIn - totalStockOut >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalStockIn - totalStockOut >= 0 ? '+' : ''}{totalStockIn - totalStockOut}
            </div>
            <p className="text-xs text-muted-foreground">
              Total stock change
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all stock transactions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
              >
                <Activity className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Table'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionDataTable
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            refreshTrigger={refreshKey}
            onTransactionDeleted={handleTransactionSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}