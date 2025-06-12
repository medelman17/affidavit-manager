'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentType, Jurisdiction } from '@/app/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, ScrollText, ShieldCheck } from 'lucide-react';

const documentTypes = [
  {
    type: DocumentType.AFFIDAVIT,
    label: 'Affidavit',
    icon: FileText,
    description: 'A written statement made under oath before a notary public or other authorized officer.',
  },
  {
    type: DocumentType.CERTIFICATION,
    label: 'Certification',
    icon: ScrollText,
    description: 'A written statement made under penalty of perjury, commonly used in New Jersey courts.',
  },
  {
    type: DocumentType.VERIFICATION,
    label: 'Verification',
    icon: ShieldCheck,
    description: 'A formal declaration that statements made in a document are true and correct.',
  },
];

const jurisdictions = [
  {
    jurisdiction: Jurisdiction.FEDERAL,
    label: 'Federal Court',
    description: 'For use in United States District Courts',
    statute: '28 U.S.C. § 1746',
  },
  {
    jurisdiction: Jurisdiction.NEW_JERSEY,
    label: 'New Jersey State Court',
    description: 'For use in New Jersey Superior and other state courts',
    statute: 'R. 1:4-4(b)',
  },
];

export default function NewDocumentPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);

  const handleContinue = () => {
    if (selectedType && selectedJurisdiction) {
      router.push(`/documents/new/form?type=${selectedType}&jurisdiction=${selectedJurisdiction}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Create New Document</h2>
        <p className="text-muted-foreground">Select the document type and jurisdiction to get started.</p>
      </div>

      <div className="space-y-8">
        {/* Document Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Document Type</CardTitle>
            <CardDescription>Choose the type of legal document you want to create</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedType || ''} onValueChange={(value) => setSelectedType(value as DocumentType)}>
              <div className="grid gap-4">
                {documentTypes.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <Label
                      key={doc.type}
                      htmlFor={doc.type}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                        selectedType === doc.type ? 'border-primary bg-accent' : 'border-input'
                      }`}
                    >
                      <RadioGroupItem value={doc.type} id={doc.type} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <span className="font-semibold">{doc.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Jurisdiction Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Jurisdiction</CardTitle>
            <CardDescription>Select the court system where this document will be filed</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedJurisdiction || ''} onValueChange={(value) => setSelectedJurisdiction(value as Jurisdiction)}>
              <div className="grid gap-4">
                {jurisdictions.map((jur) => (
                  <Label
                    key={jur.jurisdiction}
                    htmlFor={jur.jurisdiction}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                      selectedJurisdiction === jur.jurisdiction ? 'border-primary bg-accent' : 'border-input'
                    }`}
                  >
                    <RadioGroupItem value={jur.jurisdiction} id={jur.jurisdiction} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{jur.label}</div>
                      <p className="text-sm text-muted-foreground mb-2">{jur.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {jur.statute}
                      </Badge>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/documents')}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedType || !selectedJurisdiction}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}