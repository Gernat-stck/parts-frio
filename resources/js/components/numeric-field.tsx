import { FormField } from './form-field';

interface NumericFieldProps {
    id: string;
    label: string;
    value: number;
    setValue: (val: number) => void;
    error?: string;
    placeholder?: string;
    min?: number;
}

export function NumericField({ id, label, value, setValue, error, placeholder, min }: NumericFieldProps) {
    return (
        <FormField
            id={id}
            label={label}
            type="number"
            placeholder={placeholder}
            min={min}
            value={value === 0 ? '' : value}
            onFocus={(e) => {
                if (e.target.value === '0') {
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
                setValue(val === '' ? 0 : Number(val));
            }}
            error={error}
        />
    );
}
