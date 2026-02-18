'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp?: string;
}

interface AlertsListProps {
  alerts: Alert[];
  title?: string;
}

const severityConfig = {
  low: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
  },
  medium: {
    icon: AlertTriangle,
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-700 dark:text-orange-400',
  },
  high: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-700 dark:text-red-400',
  },
};

export function AlertsList({ alerts, title = 'Alerts' }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No active alerts</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'flex gap-3 p-3 rounded-lg border',
                config.bg,
                config.border
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.text)} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', config.text)}>
                  {alert.message}
                </p>
                {alert.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
