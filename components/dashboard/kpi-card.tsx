'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  delta?: number; // Percentage change
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const colorStyles: Record<string, { bg: string; text: string; accent: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    accent: 'bg-blue-500/20',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-700 dark:text-green-400',
    accent: 'bg-green-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-700 dark:text-orange-400',
    accent: 'bg-orange-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-700 dark:text-red-400',
    accent: 'bg-red-500/20',
  },
};

export function KpiCard({
  title,
  value,
  unit,
  delta,
  icon,
  trend = 'neutral',
  color = 'blue',
}: KPICardProps) {
  const styles = colorStyles[color];

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {icon && (
          <div className={cn('p-2 rounded-lg', styles.accent)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>

      {/* Delta */}
      {delta !== undefined && (
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <TrendingUp className={cn('h-4 w-4', styles.text)} />
              <span className={cn('text-sm font-medium', styles.text)}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
              </span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className={cn('h-4 w-4', styles.text)} />
              <span className={cn('text-sm font-medium', styles.text)}>
                {delta.toFixed(1)}%
              </span>
            </>
          )}
          {trend === 'neutral' && (
            <span className="text-sm text-muted-foreground">No change</span>
          )}
        </div>
      )}
    </Card>
  );
}
