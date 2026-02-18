'use client';

import { useEffect, useState } from 'react';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ChartPanel } from '@/components/dashboard/chart-panel';
import { AlertsList } from '@/components/dashboard/alerts-list';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time listener
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
  };

  return (
    <ProtectRoute>
      <AppShell>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Global Dashboard</h1>
              <p className="text-muted-foreground mt-1">Real-time hotel analytics and KPIs</p>
            </div>
            <div className="flex items-center gap-3">
              {isLive && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-600">Live</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Revenue"
              value="$42,530"
              delta="+12.5%"
              deltaType="positive"
              unit="Today"
            />
            <KpiCard
              title="Occupancy"
              value="87%"
              delta="+3.2%"
              deltaType="positive"
              unit="Today"
            />
            <KpiCard
              title="ADR"
              value="$215.50"
              delta="-2.1%"
              deltaType="negative"
              unit="Average"
            />
            <KpiCard
              title="RevPAR"
              value="$187.49"
              delta="+5.8%"
              deltaType="positive"
              unit="Today"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPanel
              title="Revenue Trend"
              subtitle="Last 7 days"
              type="line"
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Revenue',
                  data: [35000, 38000, 36500, 40000, 42000, 45500, 42530],
                }]
              }}
            />
            <ChartPanel
              title="Occupancy by Room Type"
              subtitle="Current distribution"
              type="pie"
              data={{
                labels: ['Deluxe', 'Suite', 'Standard', 'Economy'],
                datasets: [{
                  data: [45, 28, 18, 9],
                }]
              }}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartPanel
              title="Revenue by Department"
              subtitle="Breakdown"
              type="bar"
              data={{
                labels: ['Rooms', 'F&B', 'Other'],
                datasets: [{
                  label: 'Revenue',
                  data: [38000, 3500, 1030],
                }]
              }}
            />
            <ChartPanel
              title="Guest Source Distribution"
              subtitle="Booking channels"
              type="doughnut"
              data={{
                labels: ['Direct', 'OTA', 'Corporate', 'Travel Agent'],
                datasets: [{
                  data: [42, 35, 18, 5],
                }]
              }}
            />
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 gap-4">
            <AlertsList
              alerts={[
                {
                  id: '1',
                  severity: 'high',
                  title: 'Low Occupancy Alert',
                  message: 'Occupancy dropped 15% from yesterday',
                  topic: 'Occupancy',
                  timestamp: new Date(),
                },
                {
                  id: '2',
                  severity: 'medium',
                  title: 'Revenue Above Target',
                  message: 'Daily revenue exceeded target by 8%',
                  topic: 'Revenue',
                  timestamp: new Date(Date.now() - 3600000),
                },
                {
                  id: '3',
                  severity: 'low',
                  title: 'Late Check-ins',
                  message: '3 guests expected to arrive after 8 PM',
                  topic: 'Operations',
                  timestamp: new Date(Date.now() - 7200000),
                },
              ]}
            />
          </div>

          {/* Last update info */}
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
