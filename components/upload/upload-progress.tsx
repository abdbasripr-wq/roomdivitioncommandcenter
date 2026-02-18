'use client';

import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'parsing' | 'storing' | 'completed' | 'error';
  message: string;
  error?: string;
}

const statusMessages: Record<string, string> = {
  uploading: 'Uploading file...',
  parsing: 'Parsing Excel data...',
  storing: 'Storing in database...',
  completed: 'Upload complete!',
  error: 'An error occurred during upload',
};

export function UploadProgress({
  progress,
  status,
  message,
  error,
}: UploadProgressProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {message || statusMessages[status]}
          </p>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {error && (
        <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="flex gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600">File uploaded and processed successfully!</p>
        </div>
      )}
    </div>
  );
}
