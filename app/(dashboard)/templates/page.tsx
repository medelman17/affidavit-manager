import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';

const templates = [
  {
    id: '1',
    name: 'Summary Judgment Opposition',
    type: 'certification',
    jurisdiction: 'nj',
    description: 'Standard certification for opposing summary judgment motions in NJ Superior Court',
    category: 'Motion Practice',
  },
  {
    id: '2',
    name: 'Discovery Motion',
    type: 'certification',
    jurisdiction: 'federal',
    description: 'Certification in support of motion to compel discovery responses',
    category: 'Discovery',
  },
  {
    id: '3',
    name: 'Preliminary Injunction',
    type: 'affidavit',
    jurisdiction: 'federal',
    description: 'Affidavit supporting request for preliminary injunctive relief',
    category: 'Injunctive Relief',
  },
  {
    id: '4',
    name: 'Default Judgment',
    type: 'affidavit',
    jurisdiction: 'nj',
    description: 'Affidavit of amount due and owing for default judgment applications',
    category: 'Default Proceedings',
  },
  {
    id: '5',
    name: 'Expert Qualification',
    type: 'certification',
    jurisdiction: 'federal',
    description: 'Expert witness certification of qualifications and opinions',
    category: 'Expert Testimony',
  },
];

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Document Templates</h2>
        <p className="text-muted-foreground">
          Pre-built templates for common legal documents. Start with a template and customize it for your case.
        </p>
      </div>
      
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Button size="sm">
                  Use Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  <FileText className="mr-1 h-3 w-3" />
                  {template.type}
                </Badge>
                <Badge variant="outline">
                  {template.jurisdiction.toUpperCase()}
                </Badge>
                <Badge>
                  {template.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}