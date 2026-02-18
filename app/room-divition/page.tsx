'use client';

import Link from 'next/link';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ChartPanel } from '@/components/dashboard/chart-panel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus } from 'lucide-react';

export default function RoomDivisionPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.RDM, USER_ROLES.GM]}>
      <AppShell>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Room Division Dashboard</h1>
              <p className="text-muted-foreground mt-2">Unexpected costs tracking and analysis</p>
            </div>
            <Link href="/room-divition/unexpected-costs">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Today's Costs"
              value="$1,240"
              delta="+12%"
              deltaType="negative"
              unit="Unexpected"
            />
            <KpiCard
              title="WTD Total"
              value="$5,890"
              delta="+8%"
              deltaType="negative"
              unit="This Week"
            />
            <KpiCard
              title="MTD Total"
              value="$24,560"
              delta="-5%"
              deltaType="positive"
              unit="This Month"
            />
            <KpiCard
              title="Budget Used"
              value="67%"
              delta="+4%"
              deltaType="negative"
              unit="Of Budget"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPanel
              title="Daily Unexpected Costs"
              subtitle="Last 7 days"
              type="line"
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Costs',
                  data: [800, 950, 720, 1100, 1350, 1200, 1240],
                }]
              }}
            />
            <ChartPanel
              title="Costs by Department"
              subtitle="This week"
              type="bar"
              data={{
                labels: ['Front Office', 'Housekeeping'],
                datasets: [{
                  label: 'Costs',
                  data: [3200, 2690],
                }]
              }}
            />
          </div>

          {/* Cost Categories */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Cost Breakdown by Category</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { category: 'Guest Compensation', value: '$3,240', percent: '35%' },
                { category: 'Maintenance', value: '$2,890', percent: '30%' },
                { category: 'Staffing', value: '$2,430', percent: '26%' },
                { category: 'Other', value: '$784', percent: '9%' },
              ].map((item) => (
                <Card key={item.category} className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">{item.category}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{item.value}</p>
                  <p className="text-xs text-primary mt-1">{item.percent} of total</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Actions</h2>
            <Link href="/room-divition/unexpected-costs">
              <Button variant="outline" className="w-full">
                View & Manage All Expenses
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
