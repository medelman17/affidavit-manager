'use client';

import { DocumentFormData, DocumentType, Jurisdiction } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

interface SignatureTabProps {
  data: DocumentFormData;
  updateData: (updates: Partial<DocumentFormData>) => void;
  onPrev: () => void;
  onComplete: () => void;
}

export default function SignatureTab({ data, updateData, onPrev, onComplete }: SignatureTabProps) {
  const getCertificationLanguage = () => {
    if (data.jurisdiction === Jurisdiction.FEDERAL) {
      return data.type === DocumentType.AFFIDAVIT
        ? 'I declare under penalty of perjury under the laws of the United States of America that the foregoing is true and correct.'
        : 'I declare under penalty of perjury that the foregoing is true and correct. Executed on [DATE].';
    } else {
      // New Jersey
      return 'I certify that the foregoing statements made by me are true. I am aware that if any of the foregoing statements made by me are willfully false, I am subject to punishment.';
    }
  };

  const needsNotary = () => {
    return data.type === DocumentType.AFFIDAVIT && data.jurisdiction === Jurisdiction.NEW_JERSEY;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Certification Language */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-lg font-semibold mb-3">Certification Language</h3>
        <p className="text-sm italic">{getCertificationLanguage()}</p>
      </Card>

      {/* Signature Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Signature Information</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="signatureDate">Date</Label>
            <Input
              id="signatureDate"
              type="date"
              value={data.signatureBlock?.date ? new Date(data.signatureBlock.date).toISOString().split('T')[0] : ''}
              onChange={(e) => updateData({
                signatureBlock: { 
                  ...data.signatureBlock!, 
                  date: e.target.value ? new Date(e.target.value) : undefined 
                }
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="signatureLocation">Location (City, State)</Label>
            <Input
              id="signatureLocation"
              placeholder="Newark, New Jersey"
              value={data.signatureBlock?.location || ''}
              onChange={(e) => updateData({
                signatureBlock: { ...data.signatureBlock!, location: e.target.value }
              })}
            />
          </div>
        </div>

        {needsNotary() && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notaryRequired"
              checked={data.signatureBlock?.notaryRequired || false}
              onCheckedChange={(checked) => updateData({
                signatureBlock: { ...data.signatureBlock!, notaryRequired: !!checked }
              })}
            />
            <Label htmlFor="notaryRequired">This affidavit will be notarized</Label>
          </div>
        )}
      </div>

      {/* Attorney Information (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Attorney Information (Optional)</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="attorneyName">Attorney Name</Label>
            <Input
              id="attorneyName"
              placeholder="Jane Smith, Esq."
              value={data.signatureBlock?.attorneyInfo?.name || ''}
              onChange={(e) => updateData({
                signatureBlock: {
                  ...data.signatureBlock!,
                  attorneyInfo: {
                    ...data.signatureBlock?.attorneyInfo!,
                    name: e.target.value
                  }
                }
              })}
            />
          </div>

          <div>
            <Label htmlFor="attorneyBar">Bar Number</Label>
            <Input
              id="attorneyBar"
              placeholder="123456789"
              value={data.signatureBlock?.attorneyInfo?.barNumber || ''}
              onChange={(e) => updateData({
                signatureBlock: {
                  ...data.signatureBlock!,
                  attorneyInfo: {
                    ...data.signatureBlock?.attorneyInfo!,
                    barNumber: e.target.value
                  }
                }
              })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="attorneyFirm">Law Firm</Label>
          <Input
            id="attorneyFirm"
            placeholder="Smith & Associates"
            value={data.signatureBlock?.attorneyInfo?.firm || ''}
            onChange={(e) => updateData({
              signatureBlock: {
                ...data.signatureBlock!,
                attorneyInfo: {
                  ...data.signatureBlock?.attorneyInfo!,
                  firm: e.target.value
                }
              }
            })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="attorneyPhone">Phone</Label>
            <Input
              id="attorneyPhone"
              placeholder="(555) 123-4567"
              value={data.signatureBlock?.attorneyInfo?.phone || ''}
              onChange={(e) => updateData({
                signatureBlock: {
                  ...data.signatureBlock!,
                  attorneyInfo: {
                    ...data.signatureBlock?.attorneyInfo!,
                    phone: e.target.value
                  }
                }
              })}
            />
          </div>

          <div>
            <Label htmlFor="attorneyEmail">Email</Label>
            <Input
              id="attorneyEmail"
              type="email"
              placeholder="jane@smithlaw.com"
              value={data.signatureBlock?.attorneyInfo?.email || ''}
              onChange={(e) => updateData({
                signatureBlock: {
                  ...data.signatureBlock!,
                  attorneyInfo: {
                    ...data.signatureBlock?.attorneyInfo!,
                    email: e.target.value
                  }
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit">
          <FileText className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
      </div>
    </form>
  );
}