'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { UploadContainer } from '@/components/upload/upload-container';
import { USER_ROLES } from '@/components/auth/auth-context';

export default function WalkInGuestListPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.FO]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Walk-in Guest List</h1>
            <p className="text-muted-foreground mt-2">Upload and manage walk-in guest registrations</p>
          </div>
          <UploadContainer module="front-office" reportType="walk-in-guest-list" />
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
