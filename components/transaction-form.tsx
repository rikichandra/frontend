import { useState, useEffect } from 'react';
// Transaction form for multi-product transactions
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionMutations } from '@/hooks/use-transactions';
import { useProducts } from '@/hooks/use-products';
import { TransactionInput } from '@/lib/validators';
import { Plus, Minus, Trash2, Package, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransactionFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

interface TransactionItem {
  produk_id: number;
  jumlah_produk: number;
  nama_produk?: string;
  stok_produk?: number;
}

export default function TransactionForm({ onSuccess, trigger }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [jenisTransaksi, setJenisTransaksi] = useState<'in' | 'out'>('in');
  const [items, setItems] = useState<TransactionItem[]>([
    { produk_id: 0, jumlah_produk: 1 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createTransaction, loading } = useTransactionMutations();
  const { products } = useProducts({ per_page: 100 }); // Get all products

  const addItem = () => {
    setItems([...items, { produk_id: 0, jumlah_produk: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof TransactionItem, value: number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Update product info when product is selected
        if (field === 'produk_id') {
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            updatedItem.nama_produk = selectedProduct.nama_produk;
            updatedItem.stok_produk = selectedProduct.stok_produk;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
    
    // Clear errors for this item
    if (errors[`item_${index}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}`]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    items.forEach((item, index) => {
      if (item.produk_id === 0) {
        newErrors[`item_${index}_product`] = 'Product is required';
      }
      
      if (item.jumlah_produk <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be positive';
      }
      
      // Check stock for 'out' transactions
      if (jenisTransaksi === 'out' && item.stok_produk !== undefined) {
        if (item.jumlah_produk > item.stok_produk) {
          newErrors[`item_${index}_stock`] = `Insufficient stock. Available: ${item.stok_produk}`;
        }
      }
    });

    // Check for duplicate products
    const productIds = items.map(item => item.produk_id).filter(id => id !== 0);
    const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      newErrors.duplicate = 'Each product can only be selected once per transaction';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const transactionData: TransactionInput = {
        jenis_transaksi: jenisTransaksi,
        produk: items.map(item => ({
          produk_id: item.produk_id,
          jumlah_produk: item.jumlah_produk,
        })),
      };

      await createTransaction(transactionData);
      
      // Reset form and close dialog
      resetForm();
      setOpen(false);
      
      // Trigger success callback to refresh parent data
      console.log('Transaction created successfully, calling onSuccess callback');
      onSuccess?.();
      
    } catch (error) {
      // Error is handled in the mutation hook
      console.error('Transaction creation failed:', error);
    }
  };

  const resetForm = () => {
    setJenisTransaksi('in');
    setItems([{ produk_id: 0, jumlah_produk: 1 }]);
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const getTransactionTypeColor = (type: 'in' | 'out') => {
    return type === 'in' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionTypeIcon = (type: 'in' | 'out') => {
    return type === 'in' ? <Package className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />;
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.jumlah_produk, 0);
  };

  const getSelectedProducts = () => {
    return items.filter(item => item.produk_id !== 0).length;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select
              value={jenisTransaksi}
              onValueChange={(value) => setJenisTransaksi(value as 'in' | 'out')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span>Stock In (Add Stock)</span>
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-red-600" />
                    <span>Stock Out (Remove Stock)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTransactionTypeIcon(jenisTransaksi)}
                  <span className={getTransactionTypeColor(jenisTransaksi)}>
                    {jenisTransaksi === 'in' ? 'Stock In Transaction' : 'Stock Out Transaction'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getSelectedProducts()} products, {getTotalItems()} total items
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {jenisTransaksi === 'in' 
                  ? 'Add multiple products to inventory. This will increase stock levels.' 
                  : 'Remove multiple products from inventory. Stock levels will be decreased.'}
              </p>
            </CardContent>
          </Card>

          {/* Error Messages */}
          {errors.duplicate && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.duplicate}</p>
            </div>
          )}

          {/* Product Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Products</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </div>

            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    {/* Product Selection */}
                    <div className="col-span-5">
                      <Label htmlFor={`product_${index}`}>Product</Label>
                      <Select
                        value={item.produk_id.toString()}
                        onValueChange={(value) => updateItem(index, 'produk_id', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              <div className="flex items-center justify-between w-full">
                                <span>{product.nama_produk}</span>
                                <Badge variant="outline" className="ml-2">
                                  Stock: {product.stok_produk}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`item_${index}_product`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_product`]}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-3">
                      <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                      <Input
                        id={`quantity_${index}`}
                        type="number"
                        min="1"
                        value={item.jumlah_produk}
                        onChange={(e) => updateItem(index, 'jumlah_produk', parseInt(e.target.value) || 0)}
                        placeholder="Enter quantity"
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                      {errors[`item_${index}_stock`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_stock`]}</p>
                      )}
                    </div>

                    {/* Current Stock Display */}
                    <div className="col-span-3">
                      <Label>Current Stock</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        <span className="text-sm text-muted-foreground">
                          {item.stok_produk !== undefined ? item.stok_produk : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Preview */}
                  {item.produk_id !== 0 && item.nama_produk && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.nama_produk}</span>
                        <span className="text-muted-foreground">
                          {jenisTransaksi === 'in' 
                            ? `New stock: ${(item.stok_produk || 0) + item.jumlah_produk}`
                            : `New stock: ${Math.max(0, (item.stok_produk || 0) - item.jumlah_produk)}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transaction Summary */}
          {getSelectedProducts() > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{getSelectedProducts()}</div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getTotalItems()}</div>
                    <div className="text-xs text-muted-foreground">Total Items</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${jenisTransaksi === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                      {jenisTransaksi === 'in' ? '+' : '-'}{getTotalItems()}
                    </div>
                    <div className="text-xs text-muted-foreground">Stock Change</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || getSelectedProducts() === 0}
              className={jenisTransaksi === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? 'Creating...' : `Create ${jenisTransaksi === 'in' ? 'Stock In' : 'Stock Out'}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}