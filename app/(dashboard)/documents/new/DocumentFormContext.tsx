'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DocumentFormData } from '@/app/types';
import { DocumentType, Jurisdiction } from '@/app/types/document';

interface DocumentFormContextValue {
  formData: DocumentFormData;
  updateFormData: (updates: Partial<DocumentFormData>) => void;
  resetFormData: () => void;
}

const DocumentFormContext = createContext<DocumentFormContextValue | null>(null);

export function useDocumentForm() {
  const context = useContext(DocumentFormContext);
  if (!context) {
    throw new Error('useDocumentForm must be used within DocumentFormProvider');
  }
  return context;
}

interface DocumentFormProviderProps {
  children: React.ReactNode;
}

const initialFormData: DocumentFormData = {
  type: DocumentType.AFFIDAVIT,
  jurisdiction: Jurisdiction.FEDERAL,
  caseInfo: {
    caption: '',
    caseNumber: '',
    court: 'United States District Court',
  },
  declarant: {
    name: '',
  },
  paragraphs: [],
  exhibits: [],
  signatureBlock: {
    declarantName: '',
  },
};

export function DocumentFormProvider({ children }: DocumentFormProviderProps) {
  const [formData, setFormData] = useState<DocumentFormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<DocumentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetFormData,
    }),
    [formData, updateFormData, resetFormData]
  );

  return (
    <DocumentFormContext.Provider value={contextValue}>
      {children}
    </DocumentFormContext.Provider>
  );
}