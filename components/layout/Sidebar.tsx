'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Receipt, 
  Users 
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Products', 
      href: '/dashboard/products', 
      icon: Package 
    },
    { 
      name: 'Categories', 
      href: '/dashboard/categories', 
      icon: FolderTree 
    },
    { 
      name: 'Transactions', 
      href: '/dashboard/transactions', 
      icon: Receipt 
    },
    { 
      name: 'Admins', 
      href: '/dashboard/admins', 
      icon: Users 
    },
  ];

  return (
    <div className={cn('bg-card border-r w-64 h-screen', className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}