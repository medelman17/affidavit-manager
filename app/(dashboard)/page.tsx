import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileStack } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Welcome to Affidavit Manager</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Create legally compliant affidavits, certifications, and verifications for civil litigation.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create New Document
            </CardTitle>
            <CardDescription>
              Start creating a new affidavit, certification, or verification with our guided workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/documents/new">Create Document</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileStack className="h-5 w-5" />
              Browse Templates
            </CardTitle>
            <CardDescription>
              Use pre-built templates for common motions and legal documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/templates">View Templates</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Supported Jurisdictions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Federal Courts (28 U.S.C. § 1746)</li>
            <li>New Jersey State Courts (R. 1:4-4(b))</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}