'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Application Settings</h1>
            <p className="text-muted-foreground mt-2">Configure system-wide settings and preferences</p>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Hotel Information</h3>
                  
                  <div>
                    <Label>Hotel Name</Label>
                    <Input placeholder="Ramayana Hotel" defaultValue="Ramayana Hotel" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Rooms</Label>
                      <Input type="number" placeholder="120" defaultValue="120" />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Input placeholder="USD" defaultValue="USD" />
                    </div>
                  </div>

                  <div>
                    <Label>Timezone</Label>
                    <Input placeholder="Asia/Jakarta" defaultValue="Asia/Jakarta" />
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                <p className="text-muted-foreground">Notification settings coming soon.</p>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Configuration</h3>
                <p className="text-muted-foreground">Analytics settings coming soon.</p>
              </Card>
            </TabsContent>

            {/* API */}
            <TabsContent value="api">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">API Settings</h3>
                <p className="text-muted-foreground">API configuration coming soon.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
