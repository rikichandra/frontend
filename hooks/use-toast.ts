'use client';

import { useState } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Toast) => {
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== toast));
    }, 5000);
    
    // For now, just use console.log or alert for simple feedback
    if (toast.variant === 'destructive') {
      console.error(`${toast.title}: ${toast.description}`);
    } else {
      console.log(`${toast.title}: ${toast.description}`);
    }
  };

  return { toast, toasts };
}