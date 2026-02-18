'use client';

import { cn } from '@/lib/utils';
import { Check, Loader } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

interface UploadStepperProps {
  steps: Step[];
  currentStep: number;
}

export function UploadStepper({ steps, currentStep }: UploadStepperProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-border rounded-full" />

        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Status indicator */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-colors',
                  step.status === 'completed' && 'bg-primary text-primary-foreground',
                  step.status === 'in-progress' && 'bg-primary text-primary-foreground',
                  step.status === 'pending' && 'bg-border text-muted-foreground',
                  step.status === 'error' && 'bg-destructive text-destructive-foreground'
                )}
              >
                {step.status === 'completed' && <Check className="h-5 w-5" />}
                {step.status === 'in-progress' && (
                  <Loader className="h-5 w-5 animate-spin" />
                )}
                {step.status === 'pending' && <span>{index + 1}</span>}
                {step.status === 'error' && <span>!</span>}
              </div>

              {/* Label */}
              <p
                className={cn(
                  'mt-2 text-xs font-medium text-center max-w-[100px] break-words',
                  step.status === 'pending' && 'text-muted-foreground',
                  step.status === 'in-progress' && 'text-primary',
                  step.status === 'completed' && 'text-foreground',
                  step.status === 'error' && 'text-destructive'
                )}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
