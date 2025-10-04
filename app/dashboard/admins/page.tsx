import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminsPage() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage system administrators and their permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>
            View and manage all system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin management interface will be implemented here.</p>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Example admin cards */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">john@example.com</p>
                <p className="text-sm text-muted-foreground">Super Admin</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Jane Smith</h3>
                <p className="text-sm text-muted-foreground">jane@example.com</p>
                <p className="text-sm text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}