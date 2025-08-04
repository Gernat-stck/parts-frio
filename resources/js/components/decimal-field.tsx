import React from 'react';
import { FormField } from './form-field';

interface DecimalFieldProps {
    id: string;
    label: string;
    value: number;
    setValue: (val: number) => void;
    error?: string;
    placeholder?: string;
    prefix?: React.ReactNode;
    step?: number;
    min?: number;
    max?: number;
}

export function DecimalField({ id, label, value, setValue, error, placeholder, prefix, step = 0.01, min, max }: DecimalFieldProps) {
    return (
        <FormField
            id={id}
            label={label}
            type="number"
            step={step}
            min={min}
            max={max}
            placeholder={placeholder}
            prefix={prefix}
            value={value === 0 ? '' : value}
            onFocus={(e) => {
                if (e.target.value === '0' || e.target.value === '0.00') {
                    e.target.value = '';
                }
            }}
            onBlur={(e) => {
                if (e.target.value === '') {
                    setValue(0);
                }
            }}
            onChange={(e) => {
                const val = e.target.value;
                setValue(val === '' ? 0 : parseFloat(val));
            }}
            error={error}
        />
    );
}
