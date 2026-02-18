'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: any;
  onChange: (value: any) => void;
  options?: { label: string; value: any }[];
}

interface FiltersBarProps {
  filters: FilterConfig[];
  onClear: () => void;
  isActive: boolean;
}

export function FiltersBar({ filters, onClear, isActive }: FiltersBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <Button
        variant={isActive ? 'default' : 'outline'}
        onClick={() => setExpanded(!expanded)}
        className="gap-2"
      >
        <span>Filters</span>
        {isActive && (
          <span className="ml-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
            {filters.filter(f => f.value).length} active
          </span>
        )}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
        />
      </Button>

      {/* Filters Panel */}
      {expanded && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">
                  {filter.label}
                </Label>

                {filter.type === 'text' && (
                  <Input
                    id={filter.id}
                    type="text"
                    placeholder={`Filter by ${filter.label.toLowerCase()}`}
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="h-9"
                  />
                )}

                {filter.type === 'number' && (
                  <Input
                    id={filter.id}
                    type="number"
                    placeholder={`Enter ${filter.label.toLowerCase()}`}
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value ? Number(e.target.value) : '')}
                    className="h-9"
                  />
                )}

                {filter.type === 'date' && (
                  <Input
                    id={filter.id}
                    type="date"
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="h-9"
                  />
                )}

                {filter.type === 'select' && (
                  <select
                    id={filter.id}
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
                  >
                    <option value="">Select...</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex justify-end pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClear();
                  setExpanded(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
