import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormField } from '@/constants/employeeConstants';
import { Calendar, Lock } from 'lucide-react';
import React from 'react';

interface DynamicFormFieldProps {
    field: FormField;
    value: string;
    onChange: (value: string) => void;
    isEditing?: boolean;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({ field, value, onChange, isEditing = false }) => {
    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Función para formatear fecha para mostrar (DD/MM/YYYY)
    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Establecer valores por defecto para nuevos empleados
    React.useEffect(() => {
        if (!isEditing && !value) {
            if (field.id === 'startDate') {
                onChange(getCurrentDate());
            } else if (field.id === 'status') {
                onChange('active'); // Valor por defecto "active"
            }
        }
    }, [field.id, isEditing, value, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleSelectChange = (newValue: string) => {
        onChange(newValue);
    };

    // Determinar si el campo debe ser readonly
    const isReadonly = field.id === 'startDate' && isEditing;

    const renderField = () => {
        switch (field.type) {
            case 'select':
                return (
                    <Select value={value} onValueChange={handleSelectChange} required={field.required} disabled={isReadonly}>
                        <SelectTrigger className="text-sm sm:text-base">
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'date':
                // Manejo especial para campos de fecha
                if (isReadonly) {
                    // Mostrar fecha formateada cuando es readonly
                    return (
                        <div className="relative">
                            <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{formatDateForDisplay(value) || 'Fecha no establecida'}</span>
                            </div>
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Lock className="h-3 w-3" />
                                    <span className="hidden sm:inline">No editable</span>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    // Input de fecha normal cuando es editable - SIN icono superpuesto
                    return (
                        <div className="relative">
                            <Input
                                id={field.id}
                                type="date"
                                value={value}
                                onChange={handleChange}
                                required={field.required}
                                className="pr-10 text-sm sm:text-base [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <Calendar className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        </div>
                    );
                }
            default:
                return (
                    <Input
                        id={field.id}
                        type={field.type}
                        value={value}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        readOnly={isReadonly}
                        className={`text-sm sm:text-base ${isReadonly ? 'cursor-not-allowed bg-muted/50 text-muted-foreground' : ''}`}
                    />
                );
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
                {isReadonly && <span className="ml-2 text-xs text-muted-foreground">(Establecida al crear el empleado)</span>}
            </Label>
            {renderField()}
            {isReadonly && <p className="text-xs text-muted-foreground">La fecha de inicio no puede modificarse una vez establecida.</p>}
        </div>
    );
};
