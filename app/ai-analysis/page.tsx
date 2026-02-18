'use client';

import Link from 'next/link';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
} from 'lucide-react';

const analysisTopics = [
  {
    title: 'Occupancy Analysis',
    description: 'Room occupancy trends and patterns',
    href: '/ai-analysis/occupancy',
    icon: Users,
    badge: 'BETA',
  },
  {
    title: 'Revenue Analysis',
    description: 'Revenue performance and trends',
    href: '/ai-analysis/revenue',
    icon: DollarSign,
    badge: 'BETA',
  },
  {
    title: 'ADR & RevPAR',
    description: 'Average daily rate analysis',
    href: '/ai-analysis/adr-revpar',
    icon: TrendingUp,
    badge: 'BETA',
  },
  {
    title: 'Market Segments',
    description: 'Guest segmentation analysis',
    href: '/ai-analysis/market-segment',
    icon: PieChart,
    badge: 'BETA',
  },
  {
    title: 'Source of Business',
    description: 'Booking source analysis',
    href: '/ai-analysis/source-of-business',
    icon: BarChart3,
    badge: 'BETA',
  },
  {
    title: 'Room Type Performance',
    description: 'Performance by room type',
    href: '/ai-analysis/room-type-performance',
    icon: Target,
    badge: 'BETA',
  },
  {
    title: 'Executive Summary',
    description: 'High-level business overview',
    href: '/ai-analysis/executive-summary',
    icon: Zap,
    badge: 'NEW',
  },
  {
    title: 'Forecast',
    description: '7, 14, and 30-day forecasts',
    href: '/ai-analysis/forecast',
    icon: Calendar,
    badge: 'BETA',
  },
  {
    title: 'AI Alerts',
    description: 'Automated anomaly detection',
    href: '/ai-analysis/ai-alert',
    icon: AlertTriangle,
    badge: 'BETA',
  },
];

export default function AIAnalysisPage() {
  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.GM]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">AI Analysis</h1>
            <p className="text-muted-foreground mt-2">
              Unlock insights powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link key={topic.href} href={topic.href}>
                  <Card className="p-6 h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Icon className="h-8 w-8 text-primary" />
                        {topic.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                            {topic.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
