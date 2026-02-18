'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { UploadContainer } from '@/components/upload/upload-container';
import { USER_ROLES } from '@/components/auth/auth-context';

export default function InHouseGuestListPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.FO]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">In-House Guest List</h1>
            <p className="text-muted-foreground mt-2">Upload and analyze in-house guest reports</p>
          </div>
          <UploadContainer module="front-office" reportType="in-house-guest-list" />
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
