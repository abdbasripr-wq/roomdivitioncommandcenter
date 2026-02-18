'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { UploadContainer } from '@/components/upload/upload-container';
import { USER_ROLES } from '@/components/auth/auth-context';

export default function CostControlAmenitisPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.HK]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Cost Control - Amenities</h1>
            <p className="text-muted-foreground mt-2">Upload and track amenity costs and inventory</p>
          </div>
          <UploadContainer module="housekeeping" reportType="cost-control-amenites" />
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
