'use client';

import { DocumentFormData } from '@/app/types';
import { Button } from '@/components/ui/button';
import { ValidatedInput, ValidatedTextarea } from '@/components/ui/form-field';
import { ArrowRight } from 'lucide-react';
import { useFormValidation } from '@/app/hooks/useFormValidation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface BasicsTabProps {
  data: DocumentFormData;
  updateData: (updates: Partial<DocumentFormData>) => void;
  onNext: () => void;
}

export default function BasicsTab({ data, updateData, onNext }: BasicsTabProps) {
  const { validateStep, getStepErrors } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateStep('basics', data);
    if (!validation.isValid) {
      toast.error(`Please fix the following errors: ${validation.errors.join(', ')}`);
      return;
    }
    
    onNext();
  };

  // Get current validation errors
  const errors = getStepErrors('basics');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Case Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Case Information</h3>
        
        <ValidatedTextarea
          label="Case Caption"
          required
          placeholder="JOHN DOE, Plaintiff, v. JANE ROE, Defendant"
          value={data.caseInfo?.caption || ''}
          onChange={(e) => updateData({
            caseInfo: { ...data.caseInfo!, caption: e.target.value }
          })}
          className="min-h-[100px]"
          hint="Include party names separated by 'v.' or 'vs.'"
          error={errors.find(e => e.includes('Case Caption'))?.replace('Case Caption: ', '')}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ValidatedInput
            label="Case Number"
            required
            placeholder="2:24-cv-12345"
            value={data.caseInfo?.caseNumber || ''}
            onChange={(e) => updateData({
              caseInfo: { ...data.caseInfo!, caseNumber: e.target.value }
            })}
            hint="Include docket number format for your jurisdiction"
            error={errors.find(e => e.includes('Case Number'))?.replace('Case Number: ', '')}
          />

          <ValidatedInput
            label="Court"
            required
            value={data.caseInfo?.court || ''}
            onChange={(e) => updateData({
              caseInfo: { ...data.caseInfo!, court: e.target.value }
            })}
            placeholder="Enter court name"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ValidatedInput
            label="Judge (Optional)"
            placeholder="Hon. John Smith"
            value={data.caseInfo?.judge || ''}
            onChange={(e) => updateData({
              caseInfo: { ...data.caseInfo!, judge: e.target.value }
            })}
          />

          <ValidatedInput
            label="Division/Venue (Optional)"
            placeholder="Law Division"
            value={data.caseInfo?.division || ''}
            onChange={(e) => updateData({
              caseInfo: { ...data.caseInfo!, division: e.target.value }
            })}
          />
        </div>
      </div>

      {/* Declarant Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Declarant Information</h3>
        
        <ValidatedInput
          label="Full Name"
          required
          placeholder="John Doe"
          value={data.declarant?.name || ''}
          onChange={(e) => updateData({
            declarant: { ...data.declarant!, name: e.target.value }
          })}
          error={errors.find(e => e.includes('Declarant Name'))?.replace('Declarant Name: ', '')}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ValidatedInput
            label="Title (Optional)"
            placeholder="President"
            value={data.declarant?.title || ''}
            onChange={(e) => updateData({
              declarant: { ...data.declarant!, title: e.target.value }
            })}
          />

          <ValidatedInput
            label="Organization (Optional)"
            placeholder="ABC Corporation"
            value={data.declarant?.organization || ''}
            onChange={(e) => updateData({
              declarant: { ...data.declarant!, organization: e.target.value }
            })}
          />
        </div>

        <ValidatedTextarea
          label="Address (Optional)"
          placeholder="123 Main Street, Suite 100, City, State 12345"
          value={data.declarant?.address || ''}
          onChange={(e) => updateData({
            declarant: { ...data.declarant!, address: e.target.value }
          })}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}