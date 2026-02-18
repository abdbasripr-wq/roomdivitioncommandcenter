'use client';

import { useRealtimeData } from '@/lib/firebase/hooks';
import { UploadMetadata } from '@/lib/parsers/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Trash2, Clock, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UploadHistoryProps {
  module?: string;
}

export function UploadHistory({ module }: UploadHistoryProps) {
  const path = module ? `uploads?module=${module}` : 'uploads';
  const { data: uploads, loading } = useRealtimeData<Record<string, UploadMetadata>>(path);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading upload history...</p>
      </Card>
    );
  }

  const uploadList = uploads ? Object.values(uploads).sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  ) : [];

  if (uploadList.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No uploads yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Upload History</h3>
      <div className="space-y-2">
        {uploadList.map((upload) => (
          <Card key={upload.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4 flex-1">
              {/* Status Icon */}
              <div className="mt-1">
                {upload.status === 'completed' && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {upload.status === 'processing' && (
                  <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {upload.status === 'failed' && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {upload.filename}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{upload.reportType}</span>
                  <span>•</span>
                  <span>{upload.rowCount} rows</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(upload.uploadedAt), { addSuffix: true })}</span>
                </div>
                {upload.error && (
                  <p className="text-xs text-destructive mt-1">{upload.error}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
