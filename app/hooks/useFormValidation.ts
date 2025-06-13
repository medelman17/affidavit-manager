'use client';

import { useState, useCallback } from 'react';
import { ValidationResult, validateFormStep, validateCompleteDocument } from '@/app/lib/validation';

export interface FormValidationState {
  [step: string]: ValidationResult;
}

export function useFormValidation() {
  const [validationState, setValidationState] = useState<FormValidationState>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateStep = useCallback((step: string, data: any): ValidationResult => {
    const result = validateFormStep(step, data);
    
    setValidationState(prev => ({
      ...prev,
      [step]: result
    }));

    return result;
  }, []);

  const validateComplete = useCallback((data: any): ValidationResult => {
    setIsValidating(true);
    
    const result = validateCompleteDocument(data);
    
    // Also validate individual steps for detailed feedback
    const steps = ['basics', 'content', 'signature'];
    const stepResults: FormValidationState = {};
    
    for (const step of steps) {
      stepResults[step] = validateFormStep(step, data);
    }
    
    setValidationState(stepResults);
    setIsValidating(false);
    
    return result;
  }, []);

  const getStepValidation = useCallback((step: string): ValidationResult | undefined => {
    return validationState[step];
  }, [validationState]);

  const isStepValid = useCallback((step: string): boolean => {
    const result = validationState[step];
    return result ? result.isValid : true; // Assume valid if not validated yet
  }, [validationState]);

  const getStepErrors = useCallback((step: string): string[] => {
    const result = validationState[step];
    return result ? result.errors : [];
  }, [validationState]);

  const clearValidation = useCallback((step?: string) => {
    if (step) {
      setValidationState(prev => {
        const newState = { ...prev };
        delete newState[step];
        return newState;
      });
    } else {
      setValidationState({});
    }
  }, []);

  return {
    validationState,
    isValidating,
    validateStep,
    validateComplete,
    getStepValidation,
    isStepValid,
    getStepErrors,
    clearValidation
  };
}