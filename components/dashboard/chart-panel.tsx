'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExport?: () => void;
  fullHeight?: boolean;
}

export function ChartPanel({
  title,
  subtitle,
  children,
  onExport,
  fullHeight = false,
}: ChartPanelProps) {
  return (
    <Card className={`p-6 space-y-4 ${fullHeight ? 'h-full' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </Card>
  );
}
