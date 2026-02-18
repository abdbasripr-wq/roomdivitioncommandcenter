'use client';

import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { UploadContainer } from '@/components/upload/upload-container';
import { USER_ROLES } from '@/components/auth/auth-context';

export default function PaymentJournalByUsersPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.FO]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Payment Journal by Users</h1>
            <p className="text-muted-foreground mt-2">Upload and review user payment transaction journals</p>
          </div>
          <UploadContainer module="front-office" reportType="payment-journal" />
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
