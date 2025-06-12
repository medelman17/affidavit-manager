import { DocumentType, Jurisdiction, LegalDocument } from './document';

export interface DocumentFormData extends Partial<LegalDocument> {
  currentStep?: FormStep;
}

export enum FormStep {
  TYPE_SELECTION = 'type_selection',
  BASICS = 'basics',
  CONTENT = 'content',
  EXHIBITS = 'exhibits',
  SIGNATURE = 'signature',
  REVIEW = 'review'
}

export interface FormStepConfig {
  id: FormStep;
  label: string;
  description?: string;
  isRequired: boolean;
  validationSchema?: any; // Will use Zod schemas
}

export interface DocumentTypeOption {
  type: DocumentType;
  label: string;
  description: string;
  icon?: string;
}

export interface JurisdictionOption {
  jurisdiction: Jurisdiction;
  label: string;
  description: string;
  statute?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormContext {
  data: DocumentFormData;
  errors: ValidationError[];
  currentStep: FormStep;
  completedSteps: FormStep[];
  isValid: boolean;
}