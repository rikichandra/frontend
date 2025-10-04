import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryInput } from '@/lib/validators';
import { useCategoryMutations } from '@/hooks/use-categories';
import { Category } from '@/services/category.service';
import { Plus, Edit } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function CategoryForm({ category, onSuccess, trigger }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryInput>({
    nama_kategori: category?.nama_kategori || '',
    deskripsi_kategori: category?.deskripsi_kategori || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createCategory, updateCategory, loading } = useCategoryMutations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama_kategori.trim()) {
      newErrors.nama_kategori = 'Category name is required';
    } else if (formData.nama_kategori.length < 2) {
      newErrors.nama_kategori = 'Category name must be at least 2 characters';
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
      if (category) {
        await updateCategory(category.id, formData);
      } else {
        await createCategory(formData);
      }
      setOpen(false);
      setFormData({ nama_kategori: '', deskripsi_kategori: '' });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFormData({ nama_kategori: '', deskripsi_kategori: '' });
      setErrors({});
    } else if (category) {
      setFormData({
        nama_kategori: category.nama_kategori,
        deskripsi_kategori: category.deskripsi_kategori || '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {category ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_kategori">Category Name</Label>
            <Input
              id="nama_kategori"
              name="nama_kategori"
              value={formData.nama_kategori}
              onChange={handleInputChange}
              placeholder="Enter category name"
            />
            {errors.nama_kategori && (
              <p className="text-sm text-red-500">{errors.nama_kategori}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deskripsi_kategori">Description</Label>
            <Textarea
              id="deskripsi_kategori"
              name="deskripsi_kategori"
              value={formData.deskripsi_kategori}
              onChange={handleInputChange}
              placeholder="Enter category description (optional)"
              rows={3}
            />
            {errors.deskripsi_kategori && (
              <p className="text-sm text-red-500">{errors.deskripsi_kategori}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}