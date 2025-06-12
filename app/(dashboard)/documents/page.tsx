'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  type: string;
  jurisdiction: string;
  status: string;
  caseCaption: string;
  caseNumber: string;
  declarantName: string;
  createdAt: string;
  paragraphs: any[];
  exhibits: any[];
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getJurisdictionLabel = (jurisdiction: string) => {
    return jurisdiction === 'nj' ? 'New Jersey' : 'Federal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'final':
        return 'default';
      case 'filed':
        return 'success';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Documents</h2>
          <p className="text-muted-foreground">Manage your legal documents</p>
        </div>
        <Button asChild>
          <Link href="/documents/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Document
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            Loading documents...
          </div>
        </Card>
      ) : documents.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first legal document
            </p>
            <Button asChild>
              <Link href="/documents/new">Create Document</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {doc.caseCaption}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {doc.caseNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      <FileText className="mr-1 h-3 w-3" />
                      {getDocumentTypeLabel(doc.type)}
                    </Badge>
                    <Badge variant="outline">
                      {getJurisdictionLabel(doc.jurisdiction)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {doc.declarantName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{doc.paragraphs.length} paragraphs</span>
                    <span>{doc.exhibits.length} exhibits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}