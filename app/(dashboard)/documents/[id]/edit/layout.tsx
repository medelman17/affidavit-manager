'use client';

import { DocumentFormProvider } from '../../new/DocumentFormContext';

interface EditLayoutProps {
  children: React.ReactNode;
  editor: React.ReactNode;
  preview: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function EditLayout({ children, editor, preview }: EditLayoutProps) {
  return (
    <DocumentFormProvider>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Editor Panel */}
        <div className="flex-1 overflow-auto">
          {editor}
        </div>
        
        {/* Preview Panel */}
        <div className="flex-1 overflow-auto border-l border-border pl-6">
          {preview}
        </div>
      </div>
    </DocumentFormProvider>
  );
}