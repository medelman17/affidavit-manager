'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { DocumentType, Jurisdiction, FormStep } from '@/app/types';
import { useDocumentForm } from '../DocumentFormContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Save, FileText, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useFormValidation } from '@/app/hooks/useFormValidation';
import BasicsTab from '../form/BasicsTab';
import ContentTab from '../form/ContentTab';
import ExhibitsTab from '../form/ExhibitsTab';
import SignatureTab from '../form/SignatureTab';

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
  const [saving, setSaving] = useState(false);
  const { formData, updateFormData } = useDocumentForm();
  const { validateComplete } = useFormValidation();

  useEffect(() => {
    // Initialize form data from URL params
    const type = searchParams.get('type') as DocumentType;
    const jurisdiction = searchParams.get('jurisdiction') as Jurisdiction;
    
    if (!type || !jurisdiction) {
      router.push('/documents/new');
      return;
    }

    updateFormData({
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
  }, [searchParams, router, updateFormData]);

  const handleSave = async () => {
    setSaving(true);
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
      
      toast.success('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    // Validate the complete document before generating
    const validation = validateComplete(formData);
    if (!validation.isValid) {
      toast.error(`Please fix the following errors before generating: ${validation.errors.slice(0, 3).join(', ')}${validation.errors.length > 3 ? '...' : ''}`);
      return;
    }

    setSaving(true);
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
      
      // Generate PDF
      window.open(`/api/documents/${savedDocument.id}/pdf`, '_blank');
      
      toast.success('Document generated successfully!');
      router.push('/documents');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setSaving(false);
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
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>
            <Button onClick={handleGenerate} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Document
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
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
                <ErrorBoundary>
                  <BasicsTab
                    data={formData}
                    updateData={updateFormData}
                    onNext={() => setActiveTab(FormStep.CONTENT)}
                  />
                </ErrorBoundary>
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
                <ErrorBoundary>
                  <ContentTab
                    data={formData}
                    updateData={updateFormData}
                    onNext={() => setActiveTab(FormStep.EXHIBITS)}
                    onPrev={() => setActiveTab(FormStep.BASICS)}
                  />
                </ErrorBoundary>
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
                <ErrorBoundary>
                  <ExhibitsTab
                    data={formData}
                    updateData={updateFormData}
                    onNext={() => setActiveTab(FormStep.SIGNATURE)}
                    onPrev={() => setActiveTab(FormStep.CONTENT)}
                  />
                </ErrorBoundary>
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
                <ErrorBoundary>
                  <SignatureTab
                    data={formData}
                    updateData={updateFormData}
                    onPrev={() => setActiveTab(FormStep.EXHIBITS)}
                    onComplete={handleGenerate}
                  />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}