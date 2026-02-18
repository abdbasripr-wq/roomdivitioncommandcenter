'use client';

import { useState } from 'react';
import { useFirebase } from '@/components/providers/firebase-provider';
import { ReportType } from '@/lib/parsers/types';
import { UploadDropzone } from './upload-dropzone';
import { UploadStepper, Step } from './upload-stepper';
import { UploadProgress } from './upload-progress';
import { UploadHistory } from './upload-history';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'in-house-guest-list', label: 'In-House Guest List' },
  { value: 'walk-in-guest-list', label: 'Walk-in Guest List' },
  { value: 'room-revenue-breakdown', label: 'Room Revenue Breakdown' },
  { value: 'payment-journal', label: 'Payment Journal' },
  { value: 'turnover-report', label: 'Turnover Report' },
  { value: 'summary-cashier', label: 'Summary Cashier Report' },
  { value: 'nation-country', label: 'Nation/Country Report' },
  { value: 'compliment-guest-list', label: 'Compliment Guest List' },
  { value: 'cost-control-amenites', label: 'Cost Control - Amenities' },
  { value: 'cost-control-laundry', label: 'Cost Control - Laundry' },
  { value: 'guest-laundry', label: 'Guest Laundry' },
];

interface UploadContainerProps {
  module: 'front-office' | 'housekeeping' | 'room-divition';
  reportType?: ReportType;
}

export function UploadContainer({ module, reportType: initialReportType }: UploadContainerProps) {
  const { user } = useFirebase();
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState<ReportType | ''>(initialReportType || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'storing' | 'completed' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const steps: Step[] = [
    { id: 'upload', label: 'Upload', status: status === 'idle' ? 'pending' : status === 'uploading' ? 'in-progress' : 'completed' },
    { id: 'parse', label: 'Parse', status: status === 'uploading' || status === 'idle' ? 'pending' : status === 'parsing' ? 'in-progress' : 'completed' },
    { id: 'store', label: 'Store', status: status !== 'storing' && status !== 'completed' ? 'pending' : status === 'storing' ? 'in-progress' : 'completed' },
    { id: 'analyze', label: 'Analyze', status: status === 'completed' ? 'completed' : 'pending' },
  ];

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setProgress(0);
    setStatus('idle');
  };

  const handleUpload = async () => {
    if (!file || !reportType) {
      setError('Please select a file and report type');
      return;
    }

    if (!user) {
      setError('You must be logged in to upload files');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      setStatus('uploading');

      // Send file to API for server-side parsing
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportType', reportType);
      formData.append('module', module);

      setMessage('Uploading file...');
      setProgress(25);

      const token = await user.getIdToken();
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setProgress(100);
      setStatus('completed');
      setMessage(`Successfully uploaded ${result.data?.rowCount || 0} rows`);
      
      // Reset form after delay
      setTimeout(() => {
        setFile(null);
        setReportType('');
        setProgress(0);
        setStatus('idle');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Upload Report</h2>

        <div className="space-y-6">
          {/* Steps */}
          {uploading && (
            <UploadStepper steps={steps} currentStep={steps.findIndex(s => s.status === 'in-progress') || 0} />
          )}

          {/* Dropzone */}
          {!uploading && (
            <UploadDropzone
              onFileSelected={handleFileSelected}
              disabled={uploading}
            />
          )}

          {/* Report Type Selector (only if not preset) */}
          {!uploading && file && !initialReportType && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report Type</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type..." />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show selected report type if preset */}
          {!uploading && file && initialReportType && (
            <div className="p-3 bg-muted/50 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Report Type:</span> {REPORT_TYPES.find(t => t.value === initialReportType)?.label}
              </p>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <UploadProgress
              progress={progress}
              status={status as any}
              message={message}
              error={error || undefined}
            />
          )}

          {/* Action Buttons */}
          {!uploading && file && (
            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={!reportType || uploading}
                className="flex-1"
              >
                Upload and Parse
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setReportType('');
                }}
                disabled={uploading}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Upload History */}
      <UploadHistory module={module} />
    </div>
  );
}
