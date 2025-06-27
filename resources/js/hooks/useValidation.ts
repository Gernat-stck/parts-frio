import { useState, useCallback } from 'react';
import { EmployeeFormData } from './useEmployeeForm';
import { validateEmployeeForm, ValidationError } from '@/utils/validation';

export interface UseValidationReturn {
    errors: ValidationError[];
    hasErrors: boolean;
    validate: (data: EmployeeFormData) => boolean;
    clearErrors: () => void;
    getFieldError: (fieldName: string) => string | undefined;
}

export const useValidation = (): UseValidationReturn => {
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const validate = useCallback((data: EmployeeFormData): boolean => {
        const result = validateEmployeeForm(data);
        setErrors(result.errors);
        return result.isValid;
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const getFieldError = useCallback((fieldName: string): string | undefined => {
        const error = errors.find(err => err.field === fieldName);
        return error?.message;
    }, [errors]);

    return {
        errors,
        hasErrors: errors.length > 0,
        validate,
        clearErrors,
        getFieldError,
    };
};
