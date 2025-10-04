'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/dashboard/products' },
    { name: 'Categories', href: '/dashboard/categories' },
    { name: 'Transactions', href: '/dashboard/transactions' },
    { name: 'Admins', href: '/dashboard/admins' },
  ];

  return (
    <nav className={cn('border-b bg-background', className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Admin Panel
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}