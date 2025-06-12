'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DocumentType, Jurisdiction, FormStep, DocumentFormData } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Save, FileText } from 'lucide-react';
import BasicsTab from './BasicsTab';
import ContentTab from './ContentTab';
import ExhibitsTab from './ExhibitsTab';
import SignatureTab from './SignatureTab';

const tabs = [
  { id: FormStep.BASICS, label: 'Basics', description: 'Case information and court details' },
  { id: FormStep.CONTENT, label: 'Content', description: 'Document paragraphs and statements' },
  { id: FormStep.EXHIBITS, label: 'Exhibits', description: 'Manage document exhibits' },
  { id: FormStep.SIGNATURE, label: 'Signature', description: 'Signature block and certification' },
];

export default function DocumentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(FormStep.BASICS);
  const [formData, setFormData] = useState<DocumentFormData>({});

  useEffect(() => {
    // Initialize form data from URL params
    const type = searchParams.get('type') as DocumentType;
    const jurisdiction = searchParams.get('jurisdiction') as Jurisdiction;
    
    if (!type || !jurisdiction) {
      router.push('/documents/new');
      return;
    }

    setFormData({
      type,
      jurisdiction,
      caseInfo: {
        caption: '',
        caseNumber: '',
        court: jurisdiction === Jurisdiction.FEDERAL 
          ? 'United States District Court' 
          : 'Superior Court of New Jersey',
      },
      declarant: {
        name: '',
      },
      paragraphs: [],
      exhibits: [],
      signatureBlock: {
        declarantName: '',
      },
    });
  }, [searchParams, router]);

  const updateFormData = (updates: Partial<DocumentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const savedDocument = await response.json();
      console.log('Document saved:', savedDocument);
      
      // Show success message (you could use a toast here)
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    }
  };

  const handleGenerate = async () => {
    try {
      // First save the document
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const savedDocument = await response.json();
      console.log('Document saved:', savedDocument);
      
      // TODO: Generate PDF/Word document
      alert('Document saved! PDF generation coming soon.');
      
      router.push('/documents');
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    }
  };

  const getDocumentTypeLabel = () => {
    switch (formData.type) {
      case DocumentType.AFFIDAVIT:
        return 'Affidavit';
      case DocumentType.CERTIFICATION:
        return 'Certification';
      case DocumentType.VERIFICATION:
        return 'Verification';
      default:
        return '';
    }
  };

  const getJurisdictionLabel = () => {
    switch (formData.jurisdiction) {
      case Jurisdiction.FEDERAL:
        return 'Federal';
      case Jurisdiction.NEW_JERSEY:
        return 'New Jersey';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/documents/new')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Document Type
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Create {getDocumentTypeLabel()}</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <FileText className="mr-1 h-3 w-3" />
                {getDocumentTypeLabel()}
              </Badge>
              <Badge variant="outline">{getJurisdictionLabel()}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleGenerate}>
              Generate Document
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormStep)}>
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value={FormStep.BASICS}>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the case details and court information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BasicsTab
                  data={formData}
                  updateData={updateFormData}
                  onNext={() => setActiveTab(FormStep.CONTENT)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={FormStep.CONTENT}>
            <Card>
              <CardHeader>
                <CardTitle>Document Content</CardTitle>
                <CardDescription>
                  Add the paragraphs and statements for your {getDocumentTypeLabel().toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentTab
                  data={formData}
                  updateData={updateFormData}
                  onNext={() => setActiveTab(FormStep.EXHIBITS)}
                  onPrev={() => setActiveTab(FormStep.BASICS)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={FormStep.EXHIBITS}>
            <Card>
              <CardHeader>
                <CardTitle>Exhibits</CardTitle>
                <CardDescription>
                  Manage exhibits referenced in your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExhibitsTab
                  data={formData}
                  updateData={updateFormData}
                  onNext={() => setActiveTab(FormStep.SIGNATURE)}
                  onPrev={() => setActiveTab(FormStep.CONTENT)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={FormStep.SIGNATURE}>
            <Card>
              <CardHeader>
                <CardTitle>Signature Block</CardTitle>
                <CardDescription>
                  Complete the signature and certification details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignatureTab
                  data={formData}
                  updateData={updateFormData}
                  onPrev={() => setActiveTab(FormStep.EXHIBITS)}
                  onComplete={handleGenerate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}