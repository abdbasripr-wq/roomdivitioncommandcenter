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

const FO_REPORTS = [
  { name: 'In-House Guest List', path: 'in-house-guest-list' },
  { name: 'Nation & Country Report', path: 'nation-country-report' },
  { name: 'Compliment Guest List', path: 'compliment-guest-list' },
  { name: 'Summary Cashier Report', path: 'summary-cashier-report' },
  { name: 'Turnover Report by Dept', path: 'turnover-report-by-dept' },
  { name: 'Today\'s Room Revenue', path: 'todays-room-revenue-breakdown' },
  { name: 'Payment Journal by Users', path: 'payment-journal-by-users' },
  { name: 'Walk-in Guest List', path: 'walk-in-guest-list' },
];

export default function FrontOfficePage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.FO, USER_ROLES.GM]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Front Office Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage and analyze Front Office reports</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Today's Revenue"
              value="$38,450"
              delta="+8.2%"
              deltaType="positive"
              unit="FO"
            />
            <KpiCard
              title="Guest Arrivals"
              value="24"
              delta="+2"
              deltaType="positive"
              unit="Today"
            />
            <KpiCard
              title="Guest Departures"
              value="18"
              delta="-1"
              deltaType="negative"
              unit="Today"
            />
            <KpiCard
              title="Compliments"
              value="6"
              delta="+1"
              deltaType="positive"
              unit="Today"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPanel
              title="Daily Revenue Trend"
              subtitle="Last 7 days"
              type="line"
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'FO Revenue',
                  data: [32000, 34500, 33200, 36500, 38200, 41000, 38450],
                }]
              }}
            />
            <ChartPanel
              title="Payment Methods"
              subtitle="Today"
              type="pie"
              data={{
                labels: ['Cash', 'Card', 'Check', 'Other'],
                datasets: [{
                  data: [25, 60, 10, 5],
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {FO_REPORTS.map((report) => (
                <Link key={report.path} href={`/front-office/${report.path}`}>
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
