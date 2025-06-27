import type React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/constants/employeeConstants';

interface DynamicFormFieldProps {
    field: FormField;
    value: string;
    onChange: (value: string) => void;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
    field,
    value,
    onChange,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    const renderField = () => {
        switch (field.type) {
            case 'select':
                return (
                    <select
                        id={field.id}
                        value={value}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        required={field.required}
                    >
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                return (
                    <Input
                        id={field.id}
                        type={field.type}
                        value={value}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
        }
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {renderField()}
        </div>
    );
};
