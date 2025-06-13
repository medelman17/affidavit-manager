'use client';

import { usePathname, useSearchParams } from 'next/navigation';
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Check if we're on the form route or have form parameters
  const isFormRoute = pathname.includes('/form') || (searchParams.get('type') && searchParams.get('jurisdiction'));
  
  if (!isFormRoute) {
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