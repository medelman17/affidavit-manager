'use client';

import { useState } from 'react';
import { DocumentFormData, Exhibit } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Plus, Trash2, FileText, Image, Video, FileQuestion } from 'lucide-react';

interface ExhibitsTabProps {
  data: DocumentFormData;
  updateData: (updates: Partial<DocumentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ExhibitsTab({ data, updateData, onNext, onPrev }: ExhibitsTabProps) {
  const [newExhibit, setNewExhibit] = useState<Partial<Exhibit>>({
    type: 'document',
  });

  const generateLabel = (index: number): string => {
    if (index < 26) {
      return String.fromCharCode(65 + index); // A-Z
    } else if (index < 702) {
      const first = Math.floor((index - 26) / 26);
      const second = (index - 26) % 26;
      return String.fromCharCode(65 + first) + String.fromCharCode(65 + second); // AA-ZZ
    } else {
      return `Exhibit ${index + 1}`; // Fallback for > 702
    }
  };

  const addExhibit = () => {
    if (!newExhibit.description) return;

    const exhibit: Exhibit = {
      id: Date.now().toString(),
      label: generateLabel(data.exhibits?.length || 0),
      description: newExhibit.description,
      type: newExhibit.type || 'document',
      isConfidential: newExhibit.isConfidential || false,
    };

    updateData({
      exhibits: [...(data.exhibits || []), exhibit],
    });

    // Reset form
    setNewExhibit({ type: 'document' });
  };

  const deleteExhibit = (id: string) => {
    const updated = data.exhibits?.filter(e => e.id !== id) || [];
    // Re-label exhibits
    updated.forEach((e, index) => {
      e.label = generateLabel(index);
    });
    updateData({ exhibits: updated });
  };

  const getExhibitIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileQuestion className="h-4 w-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Add Exhibit Form */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add Exhibit</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="exhibitType">Type</Label>
              <Select
                value={newExhibit.type}
                onValueChange={(value) => setNewExhibit({ ...newExhibit, type: value as Exhibit['type'] })}
              >
                <SelectTrigger id="exhibitType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="exhibitDesc">Description</Label>
              <Input
                id="exhibitDesc"
                placeholder="e.g., Contract dated January 1, 2024"
                value={newExhibit.description || ''}
                onChange={(e) => setNewExhibit({ ...newExhibit, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confidential"
              checked={newExhibit.isConfidential || false}
              onCheckedChange={(checked) => setNewExhibit({ ...newExhibit, isConfidential: !!checked })}
            />
            <Label htmlFor="confidential">Mark as confidential</Label>
          </div>

          <Button
            type="button"
            onClick={addExhibit}
            disabled={!newExhibit.description}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Exhibit
          </Button>
        </div>
      </Card>

      {/* Exhibits List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Exhibits</h3>
        
        {data.exhibits?.length === 0 || !data.exhibits ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No exhibits added yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {data.exhibits.map((exhibit) => (
              <Card key={exhibit.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getExhibitIcon(exhibit.type)}
                      <span className="font-semibold">Exhibit {exhibit.label}</span>
                    </div>
                    <span className="text-sm">{exhibit.description}</span>
                    {exhibit.isConfidential && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Confidential
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExhibit(exhibit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}