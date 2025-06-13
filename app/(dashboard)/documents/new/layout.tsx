'use client';

import { DocumentFormProvider } from './DocumentFormContext';

export default function NewDocumentLayout({
  children,
  editor,
  preview,
}: {
  children: React.ReactNode;
  editor: React.ReactNode;
  preview: React.ReactNode;
}) {
  // Check if we have editor content (form is active)
  const hasEditorContent = editor !== null;
  
  if (!hasEditorContent) {
    // Show the document type selection page
    return <>{children}</>;
  }
  
  // Show the split-screen layout with form and preview
  return (
    <DocumentFormProvider>
      <div className="flex h-[calc(100vh-4rem)] gap-4">
        {/* Editor Panel */}
        <div className="flex-1 overflow-auto">
          {editor}
        </div>
        
        {/* Preview Panel */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg border">
          {preview}
        </div>
      </div>
    </DocumentFormProvider>
  );
}