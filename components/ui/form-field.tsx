'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children?: React.ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, id, required = false, error, hint, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <Label htmlFor={id} className={cn('text-sm font-medium', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
          {label}
        </Label>
        {children}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  fieldClassName?: string;
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, required = false, error, hint, className, fieldClassName, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <FormField
        label={label}
        id={inputId}
        required={required}
        error={error}
        hint={hint}
        className={fieldClassName}
      >
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  fieldClassName?: string;
}

export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ label, required = false, error, hint, className, fieldClassName, id, ...props }, ref) => {
    const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <FormField
        label={label}
        id={textareaId}
        required={required}
        error={error}
        hint={hint}
        className={fieldClassName}
      >
        <Textarea
          ref={ref}
          id={textareaId}
          className={cn(
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);

ValidatedTextarea.displayName = 'ValidatedTextarea';