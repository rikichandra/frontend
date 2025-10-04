import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductMutations } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Product } from '@/services/product.service';
import { Plus, Edit, Upload } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function ProductForm({ product, onSuccess, trigger }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    kategori_produk_id: product?.kategori_produk_id || 0,
    nama_produk: product?.nama_produk || '',
    deskripsi_produk: product?.deskripsi_produk || '',
    stok_produk: product?.stok_produk || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.gambar_produk ? `/storage/${product.gambar_produk}` : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createProduct, updateProduct, loading } = useProductMutations();
  const { categories } = useCategories({ per_page: 100 }); // Get all categories

  useEffect(() => {
    if (product) {
      setFormData({
        kategori_produk_id: product.kategori_produk_id,
        nama_produk: product.nama_produk,
        deskripsi_produk: product.deskripsi_produk || '',
        stok_produk: product.stok_produk,
      });
      setImagePreview(product.gambar_produk ? product.gambar_produk_url ?? null : null);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'stok_produk' ? parseInt(value) || 0 : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, kategori_produk_id: parseInt(value) }));
    if (errors.kategori_produk_id) {
      setErrors(prev => ({ ...prev, kategori_produk_id: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({ ...prev, gambar_produk: 'Image size must be less than 2MB' }));
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.gambar_produk) {
        setErrors(prev => ({ ...prev, gambar_produk: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama_produk.trim()) {
      newErrors.nama_produk = 'Product name is required';
    } else if (formData.nama_produk.length < 2) {
      newErrors.nama_produk = 'Product name must be at least 2 characters';
    }

    if (formData.kategori_produk_id === 0) {
      newErrors.kategori_produk_id = 'Category is required';
    }

    if (formData.stok_produk < 0) {
      newErrors.stok_produk = 'Stock cannot be negative';
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
      const formDataToSend = new FormData();
      formDataToSend.append('kategori_produk_id', formData.kategori_produk_id.toString());
      formDataToSend.append('nama_produk', formData.nama_produk);
      formDataToSend.append('deskripsi_produk', formData.deskripsi_produk);
      formDataToSend.append('stok_produk', formData.stok_produk.toString());
      
      if (imageFile) {
        formDataToSend.append('gambar_produk', imageFile);
      }

      if (product) {
        await updateProduct(product.id, formDataToSend);
      } else {
        await createProduct(formDataToSend);
      }
      
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  const resetForm = () => {
    setFormData({
      kategori_produk_id: 0,
      nama_produk: '',
      deskripsi_produk: '',
      stok_produk: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {product ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama_produk">Product Name</Label>
              <Input
                id="nama_produk"
                name="nama_produk"
                value={formData.nama_produk}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
              {errors.nama_produk && (
                <p className="text-sm text-red-500">{errors.nama_produk}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori_produk_id">Category</Label>
              <Select
                value={formData.kategori_produk_id.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategori_produk_id && (
                <p className="text-sm text-red-500">{errors.kategori_produk_id}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi_produk">Description</Label>
            <Textarea
              id="deskripsi_produk"
              name="deskripsi_produk"
              value={formData.deskripsi_produk}
              onChange={handleInputChange}
              placeholder="Enter product description (optional)"
              rows={3}
            />
            {errors.deskripsi_produk && (
              <p className="text-sm text-red-500">{errors.deskripsi_produk}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stok_produk">Stock</Label>
            <Input
              id="stok_produk"
              name="stok_produk"
              type="number"
              min="0"
              value={formData.stok_produk}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
            />
            {errors.stok_produk && (
              <p className="text-sm text-red-500">{errors.stok_produk}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gambar_produk">Product Image</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="gambar_produk"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('gambar_produk')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            {errors.gambar_produk && (
              <p className="text-sm text-red-500">{errors.gambar_produk}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}