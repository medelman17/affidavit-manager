export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export function validateField(value: any, rules: ValidationRules): ValidationResult {
  const errors: string[] = [];

  // Required field validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: errors.length === 0, errors };
  }

  const stringValue = value.toString();

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters long`);
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters long`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('Invalid format');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return { isValid: errors.length === 0, errors };
}

// Legal document specific validation rules
export const legalDocumentValidation = {
  caseCaption: {
    required: true,
    minLength: 5,
    maxLength: 500,
    custom: (value: string) => {
      if (value && !value.includes('v.') && !value.includes('vs.')) {
        return 'Case caption should include "v." or "vs." to separate parties';
      }
      return null;
    }
  },
  caseNumber: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[A-Z0-9\-:]+$/i,
    custom: (value: string) => {
      if (value && value.length > 0 && !/\d/.test(value)) {
        return 'Case number should contain at least one number';
      }
      return null;
    }
  },
  declarantName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\.\-']+$/,
  },
  paragraphContent: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  signatureLocation: {
    required: true,
    minLength: 2,
    maxLength: 100,
  }
} as const;

export function validateFormStep(step: string, data: any): ValidationResult {
  const errors: string[] = [];

  switch (step) {
    case 'basics':
      const captionResult = validateField(data.caseInfo?.caption, legalDocumentValidation.caseCaption);
      if (!captionResult.isValid) {
        errors.push(`Case Caption: ${captionResult.errors.join(', ')}`);
      }

      const caseNumberResult = validateField(data.caseInfo?.caseNumber, legalDocumentValidation.caseNumber);
      if (!caseNumberResult.isValid) {
        errors.push(`Case Number: ${caseNumberResult.errors.join(', ')}`);
      }

      const declarantResult = validateField(data.declarant?.name, legalDocumentValidation.declarantName);
      if (!declarantResult.isValid) {
        errors.push(`Declarant Name: ${declarantResult.errors.join(', ')}`);
      }
      break;

    case 'content':
      if (!data.paragraphs || data.paragraphs.length === 0) {
        errors.push('At least one paragraph is required');
      } else {
        data.paragraphs.forEach((paragraph: any, index: number) => {
          const result = validateField(paragraph.content, legalDocumentValidation.paragraphContent);
          if (!result.isValid) {
            errors.push(`Paragraph ${index + 1}: ${result.errors.join(', ')}`);
          }
        });
      }
      break;

    case 'signature':
      const locationResult = validateField(data.signatureBlock?.location, legalDocumentValidation.signatureLocation);
      if (!locationResult.isValid) {
        errors.push(`Signature Location: ${locationResult.errors.join(', ')}`);
      }

      const sigNameResult = validateField(data.signatureBlock?.declarantName, legalDocumentValidation.declarantName);
      if (!sigNameResult.isValid) {
        errors.push(`Signature Name: ${sigNameResult.errors.join(', ')}`);
      }
      break;
  }

  return { isValid: errors.length === 0, errors };
}

export function validateCompleteDocument(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate all steps
  const stepsToValidate = ['basics', 'content', 'signature'];
  
  for (const step of stepsToValidate) {
    const stepResult = validateFormStep(step, data);
    if (!stepResult.isValid) {
      errors.push(...stepResult.errors);
    }
  }

  return { isValid: errors.length === 0, errors };
}