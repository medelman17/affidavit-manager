'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentType, Jurisdiction, FormStep, DocumentFormData } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Save, FileText, Loader2 } from 'lucide-react';
import BasicsTab from '../../new/form/BasicsTab';
import ContentTab from '../../new/form/ContentTab';
import ExhibitsTab from '../../new/form/ExhibitsTab';
import SignatureTab from '../../new/form/SignatureTab';

const tabs = [
  { id: FormStep.BASICS, label: 'Basics', description: 'Case information and court details' },
  { id: FormStep.CONTENT, label: 'Content', description: 'Document paragraphs and statements' },
  { id: FormStep.EXHIBITS, label: 'Exhibits', description: 'Manage document exhibits' },
  { id: FormStep.SIGNATURE, label: 'Signature', description: 'Signature block and certification' },
];

export default function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(FormStep.BASICS);
  const [formData, setFormData] = useState<DocumentFormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [documentId, setDocumentId] = useState<string>('');

  useEffect(() => {
    params.then((resolvedParams) => {
      setDocumentId(resolvedParams.id);
      fetchDocument(resolvedParams.id);
    });
  }, [params]);

  const fetchDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const doc = await response.json();
      
      // Transform the document data to match the form structure
      setFormData({
        type: doc.type as DocumentType,
        jurisdiction: doc.jurisdiction as Jurisdiction,
        caseInfo: {
          caption: doc.caseCaption,
          caseNumber: doc.caseNumber,
          court: doc.court,
          judge: doc.judge,
          division: doc.division,
        },
        declarant: {
          name: doc.declarantName,
          title: doc.declarantTitle,
          organization: doc.declarantOrganization,
          address: doc.declarantAddress,
        },
        personalKnowledgeStatement: doc.personalKnowledgeStatement,
        paragraphs: doc.paragraphs.map((p: any) => ({
          number: p.number,
          content: p.content,
          exhibitReferences: p.exhibitReferences,
        })),
        exhibits: doc.exhibits.map((e: any) => ({
          label: e.label,
          description: e.description,
          type: e.type,
          isConfidential: e.isConfidential,
        })),
        signatureBlock: {
          declarantName: doc.declarantName,
          date: doc.signatureDate,
          location: doc.signatureLocation,
          notaryRequired: doc.notaryRequired,
          attorneyInfo: doc.attorneyName ? {
            name: doc.attorneyName,
            barNumber: doc.attorneyBarNumber,
            firm: doc.attorneyFirm,
            phone: doc.attorneyPhone,
            email: doc.attorneyEmail,
          } : undefined,
        },
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Failed to load document. Please try again.');
      router.push('/documents');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<DocumentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
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
      
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setSaving(true);
    try {
      // First save the document
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
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
      
      router.push('/documents');
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/documents')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Edit {getDocumentTypeLabel()}</h2>
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