import { AuthGuard } from '@/components/AuthGuard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-lg w-full space-y-8">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}