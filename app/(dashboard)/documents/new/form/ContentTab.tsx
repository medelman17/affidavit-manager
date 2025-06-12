'use client';

import { useState } from 'react';
import { DocumentFormData, DocumentParagraph, DocumentType, Jurisdiction } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface ContentTabProps {
  data: DocumentFormData;
  updateData: (updates: Partial<DocumentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ContentTab({ data, updateData, onNext, onPrev }: ContentTabProps) {
  const [personalKnowledge, setPersonalKnowledge] = useState(
    data.personalKnowledgeStatement || getDefaultPersonalKnowledge()
  );

  function getDefaultPersonalKnowledge() {
    if (data.type === DocumentType.CERTIFICATION) {
      return `I, ${data.declarant?.name || '[NAME]'}, hereby certify as follows:`;
    } else if (data.type === DocumentType.AFFIDAVIT) {
      return `I, ${data.declarant?.name || '[NAME]'}, being duly sworn, depose and say:`;
    } else {
      return `I, ${data.declarant?.name || '[NAME]'}, hereby verify the following:`;
    }
  }

  const addParagraph = () => {
    const newParagraph: DocumentParagraph = {
      id: Date.now().toString(),
      number: (data.paragraphs?.length || 0) + 1,
      content: '',
    };
    updateData({
      paragraphs: [...(data.paragraphs || []), newParagraph],
    });
  };

  const updateParagraph = (id: string, content: string) => {
    updateData({
      paragraphs: data.paragraphs?.map(p => 
        p.id === id ? { ...p, content } : p
      ),
    });
  };

  const deleteParagraph = (id: string) => {
    const updated = data.paragraphs?.filter(p => p.id !== id) || [];
    // Renumber paragraphs
    updated.forEach((p, index) => {
      p.number = index + 1;
    });
    updateData({ paragraphs: updated });
  };

  const moveParagraph = (id: string, direction: 'up' | 'down') => {
    const paragraphs = [...(data.paragraphs || [])];
    const index = paragraphs.findIndex(p => p.id === id);
    
    if (direction === 'up' && index > 0) {
      [paragraphs[index], paragraphs[index - 1]] = [paragraphs[index - 1], paragraphs[index]];
    } else if (direction === 'down' && index < paragraphs.length - 1) {
      [paragraphs[index], paragraphs[index + 1]] = [paragraphs[index + 1], paragraphs[index]];
    }
    
    // Renumber paragraphs
    paragraphs.forEach((p, i) => {
      p.number = i + 1;
    });
    
    updateData({ paragraphs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ personalKnowledgeStatement: personalKnowledge });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Knowledge Statement */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Opening Statement</h3>
        <Textarea
          value={personalKnowledge}
          onChange={(e) => setPersonalKnowledge(e.target.value)}
          className="min-h-[80px]"
          placeholder="Opening statement..."
        />
      </div>

      {/* Paragraphs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Paragraphs</h3>
          <Button type="button" size="sm" onClick={addParagraph}>
            <Plus className="mr-2 h-4 w-4" />
            Add Paragraph
          </Button>
        </div>

        {data.paragraphs?.length === 0 || !data.paragraphs ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No paragraphs added yet. Click "Add Paragraph" to start.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.paragraphs.map((paragraph, index) => (
              <Card key={paragraph.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="font-semibold text-lg w-8">{paragraph.number}.</div>
                  <div className="flex-1">
                    <Textarea
                      value={paragraph.content}
                      onChange={(e) => updateParagraph(paragraph.id, e.target.value)}
                      placeholder="Enter paragraph content..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveParagraph(paragraph.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveParagraph(paragraph.id, 'down')}
                      disabled={index === data.paragraphs!.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteParagraph(paragraph.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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