'use client';

import Link from 'next/link';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ChartPanel } from '@/components/dashboard/chart-panel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, BarChart3 } from 'lucide-react';

const HK_REPORTS = [
  { name: 'Cost Control - Amenities', path: 'cost-control-amenitis' },
  { name: 'Cost Control - Laundry', path: 'cost-control-laundry' },
  { name: 'Guest Laundry', path: 'guest-laundry' },
];

export default function HousekeepingPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.HK, USER_ROLES.GM]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Housekeeping Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage and analyze Housekeeping operations</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Rooms Cleaned"
              value="92"
              delta="+5"
              deltaType="positive"
              unit="Today"
            />
            <KpiCard
              title="Cost Control"
              value="$2,540"
              delta="-8.3%"
              deltaType="positive"
              unit="Spent"
            />
            <KpiCard
              title="Laundry Items"
              value="1,240"
              delta="+120"
              deltaType="positive"
              unit="Processed"
            />
            <KpiCard
              title="Outstanding"
              value="3"
              delta="+1"
              deltaType="negative"
              unit="Rooms"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPanel
              title="Daily Spending"
              subtitle="Last 7 days"
              type="bar"
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Cost',
                  data: [2100, 2300, 2150, 2400, 2600, 2800, 2540],
                }]
              }}
            />
            <ChartPanel
              title="Cost Breakdown"
              subtitle="Today"
              type="pie"
              data={{
                labels: ['Supplies', 'Laundry', 'Equipment', 'Other'],
                datasets: [{
                  data: [45, 35, 15, 5],
                }]
              }}
            />
          </div>

          {/* Report Types Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Available Reports</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HK_REPORTS.map((report) => (
                <Link key={report.path} href={`/housekeeping/${report.path}`}>
                  <Card className="p-4 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{report.name}</h3>
                      <p className="text-xs text-muted-foreground">Upload & analyze</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
