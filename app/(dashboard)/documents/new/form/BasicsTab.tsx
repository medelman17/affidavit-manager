'use client';

import { DocumentFormData } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';

interface BasicsTabProps {
  data: DocumentFormData;
  updateData: (updates: Partial<DocumentFormData>) => void;
  onNext: () => void;
}

export default function BasicsTab({ data, updateData, onNext }: BasicsTabProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Case Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Case Information</h3>
        
        <div>
          <Label htmlFor="caption">Case Caption</Label>
          <Textarea
            id="caption"
            placeholder="JOHN DOE, Plaintiff, v. JANE ROE, Defendant"
            value={data.caseInfo?.caption || ''}
            onChange={(e) => updateData({
              caseInfo: { ...data.caseInfo!, caption: e.target.value }
            })}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="caseNumber">Case Number</Label>
            <Input
              id="caseNumber"
              placeholder="2:24-cv-12345"
              value={data.caseInfo?.caseNumber || ''}
              onChange={(e) => updateData({
                caseInfo: { ...data.caseInfo!, caseNumber: e.target.value }
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="court">Court</Label>
            <Input
              id="court"
              value={data.caseInfo?.court || ''}
              onChange={(e) => updateData({
                caseInfo: { ...data.caseInfo!, court: e.target.value }
              })}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="judge">Judge (Optional)</Label>
            <Input
              id="judge"
              placeholder="Hon. John Smith"
              value={data.caseInfo?.judge || ''}
              onChange={(e) => updateData({
                caseInfo: { ...data.caseInfo!, judge: e.target.value }
              })}
            />
          </div>

          <div>
            <Label htmlFor="division">Division/Venue (Optional)</Label>
            <Input
              id="division"
              placeholder="Law Division"
              value={data.caseInfo?.division || ''}
              onChange={(e) => updateData({
                caseInfo: { ...data.caseInfo!, division: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      {/* Declarant Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Declarant Information</h3>
        
        <div>
          <Label htmlFor="declarantName">Full Name</Label>
          <Input
            id="declarantName"
            placeholder="John Doe"
            value={data.declarant?.name || ''}
            onChange={(e) => updateData({
              declarant: { ...data.declarant!, name: e.target.value }
            })}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="declarantTitle">Title (Optional)</Label>
            <Input
              id="declarantTitle"
              placeholder="President"
              value={data.declarant?.title || ''}
              onChange={(e) => updateData({
                declarant: { ...data.declarant!, title: e.target.value }
              })}
            />
          </div>

          <div>
            <Label htmlFor="declarantOrg">Organization (Optional)</Label>
            <Input
              id="declarantOrg"
              placeholder="ABC Corporation"
              value={data.declarant?.organization || ''}
              onChange={(e) => updateData({
                declarant: { ...data.declarant!, organization: e.target.value }
              })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="declarantAddress">Address (Optional)</Label>
          <Textarea
            id="declarantAddress"
            placeholder="123 Main Street, Suite 100, City, State 12345"
            value={data.declarant?.address || ''}
            onChange={(e) => updateData({
              declarant: { ...data.declarant!, address: e.target.value }
            })}
            className="min-h-[80px]"
          />
        </div>
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