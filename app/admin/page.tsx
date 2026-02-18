'use client';

import Link from 'next/link';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Shield, Database } from 'lucide-react';

const ADMIN_SECTIONS = [
  {
    title: 'User Management',
    description: 'Manage users and their roles',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Settings',
    description: 'Configure app settings and preferences',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Security',
    description: 'Security and access control',
    href: '/admin/security',
    icon: Shield,
  },
  {
    title: 'Database',
    description: 'Database management and utilities',
    href: '/admin/database',
    icon: Database,
  },
];

export default function AdminPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage application settings and access</p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold text-foreground mt-2">28</p>
              <p className="text-xs text-primary mt-1">+2 this week</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
              <p className="text-3xl font-bold text-foreground mt-2">12</p>
              <p className="text-xs text-muted-foreground mt-1">Right now</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <p className="text-3xl font-bold text-green-600 mt-2">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Operational</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Uploads Today</p>
              <p className="text-3xl font-bold text-foreground mt-2">8</p>
              <p className="text-xs text-muted-foreground mt-1">34 files</p>
            </Card>
          </div>

          {/* Admin Sections */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ADMIN_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <Link key={section.href} href={section.href}>
                    <Card className="p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                      <div>
                        <Icon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{section.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-4">
                        Access
                      </Button>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 border-primary/50 bg-primary/5">
            <h2 className="text-lg font-semibold text-foreground mb-4">System Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Application Version</p>
                <p className="font-medium text-foreground">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Database Status</p>
                <p className="font-medium text-green-600">Connected</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Backup</p>
                <p className="font-medium text-foreground">2 hours ago</p>
              </div>
              <div>
                <p className="text-muted-foreground">API Gateway</p>
                <p className="font-medium text-green-600">Operational</p>
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
