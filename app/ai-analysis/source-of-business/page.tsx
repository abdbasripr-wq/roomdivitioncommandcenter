import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'Source of Business - AI Analysis' };

export default function SourceOfBusinessPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.GM]}>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/ai-analysis">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground">Source of Business Analysis</h1>
          </div>
          <p className="text-muted-foreground">AI-powered source of business analysis coming soon.</p>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
