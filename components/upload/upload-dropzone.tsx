'use client';

import { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export function UploadDropzone({
  onFileSelected,
  accept = '.xlsx,.xls',
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      setIsDragActive(false);
      setError(null);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.name.endsWith('.xlsx') || 
            file.name.endsWith('.xls')) {
          onFileSelected(file);
        } else {
          setError('Please upload a valid Excel file (.xlsx or .xls)');
        }
      }
    },
    [onFileSelected, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected]
  );

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/50 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-center font-medium text-foreground">
            Drag and drop your Excel file here
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            or click to browse (.xlsx, .xls)
          </p>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Max file size: 50MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
