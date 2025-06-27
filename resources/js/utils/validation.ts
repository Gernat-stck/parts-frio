import { EmployeeFormData } from '@/hooks/useEmployeeForm';
import { isValidEmail, isValidPhone } from '@/utils/employeeUtils';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Valida los datos del formulario de empleado
 */
export const validateEmployeeForm = (data: EmployeeFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validar nombre
    if (!data.name.trim()) {
        errors.push({ field: 'name', message: 'El nombre es obligatorio' });
    } else if (data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'El nombre debe tener al menos 2 caracteres' });
    }

    // Validar email
    if (!data.email.trim()) {
        errors.push({ field: 'email', message: 'El email es obligatorio' });
    } else if (!isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'El formato del email no es válido' });
    }

    // Validar teléfono
    if (!data.phone.trim()) {
        errors.push({ field: 'phone', message: 'El teléfono es obligatorio' });
    } else if (!isValidPhone(data.phone)) {
        errors.push({ field: 'phone', message: 'El formato del teléfono no es válido' });
    }

    // Validar posición
    if (!data.position.trim()) {
        errors.push({ field: 'position', message: 'La posición es obligatoria' });
    } else if (data.position.trim().length < 2) {
        errors.push({ field: 'position', message: 'La posición debe tener al menos 2 caracteres' });
    }

    // Validar fecha de inicio
    if (!data.startDate) {
        errors.push({ field: 'startDate', message: 'La fecha de inicio es obligatoria' });
    } else {
        const startDate = new Date(data.startDate);
        const today = new Date();
        
        if (startDate > today) {
            errors.push({ field: 'startDate', message: 'La fecha de inicio no puede ser futura' });
        }
        
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 50);
        
        if (startDate < minDate) {
            errors.push({ field: 'startDate', message: 'La fecha de inicio es demasiado antigua' });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
