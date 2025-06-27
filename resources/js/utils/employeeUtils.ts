/**
 * Formatea una fecha en formato español
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Calcula los años trabajando desde una fecha de inicio
 */
export const calculateYearsWorking = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();

    if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
        return years - 1;
    }
    return years;
};

/**
 * Valida el formato de un email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida el formato de un teléfono español
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?34\s?[6-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
