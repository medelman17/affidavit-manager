export enum DocumentType {
  AFFIDAVIT = 'affidavit',
  CERTIFICATION = 'certification',
  VERIFICATION = 'verification'
}

export enum Jurisdiction {
  FEDERAL = 'federal',
  NEW_JERSEY = 'nj'
}

export enum ExhibitLabel {
  ALPHA = 'alpha', // A-Z
  NUMERIC = 'numeric', // 1-99
  ALPHA_EXTENDED = 'alpha_extended' // AA-ZZ
}

export interface CaseInfo {
  caption: string;
  caseNumber: string;
  court: string;
  judge?: string;
  division?: string;
}

export interface Declarant {
  name: string;
  title?: string;
  organization?: string;
  address?: string;
}

export interface Exhibit {
  id: string;
  label: string;
  description: string;
  type: 'document' | 'image' | 'video' | 'other';
  isConfidential?: boolean;
  attachmentPath?: string;
}

export interface DocumentParagraph {
  id: string;
  number: number;
  content: string;
  exhibitReferences?: string[]; // Exhibit IDs
}

export interface SignatureBlock {
  declarantName: string;
  date?: Date;
  location?: string;
  notaryRequired?: boolean;
  attorneyInfo?: {
    name: string;
    barNumber: string;
    firm?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface LegalDocument {
  id?: string;
  type: DocumentType;
  jurisdiction: Jurisdiction;
  caseInfo: CaseInfo;
  declarant: Declarant;
  personalKnowledgeStatement?: string;
  paragraphs: DocumentParagraph[];
  exhibits: Exhibit[];
  signatureBlock: SignatureBlock;
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'draft' | 'final' | 'filed';
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  jurisdiction: Jurisdiction;
  description?: string;
  category?: string; // e.g., "summary judgment", "discovery", "preliminary injunction"
  content: Partial<LegalDocument>;
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}