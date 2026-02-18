'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportCSVProps {
  data: any[];
  filename?: string;
  columns?: string[];
}

export function ExportCSV({ data, filename = 'export', columns }: ExportCSVProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Determine columns
    const exportColumns = columns || Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      exportColumns.join(','),
      ...data.map(row =>
        exportColumns
          .map(col => {
            const value = row[col];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
          })
          .join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={data.length === 0}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
