'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MOCK_USERS = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'Admin', status: 'Active' },
  { id: '2', email: 'rdm@example.com', name: 'RDM Manager', role: 'RDM', status: 'Active' },
  { id: '3', email: 'fo@example.com', name: 'Front Office', role: 'FO', status: 'Active' },
  { id: '4', email: 'hk@example.com', name: 'Housekeeping', role: 'HK', status: 'Active' },
  { id: '5', email: 'gm@example.com', name: 'General Manager', role: 'GM', status: 'Active' },
];

export default function AdminUsersPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-2">Manage users and their access roles</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_USERS.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
