import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>;

interface FormFieldProps extends Partial<NativeInputProps> {
    id: string;
    label: string;
    error?: string;
    prefix?: React.ReactNode;
    children?: React.ReactNode;
    actionButton?: {
        label?: string;
        icon?: React.ReactNode;
        onClick: () => void;
        title?: string;
    };
}

export function FormField({ id, label, error, prefix, children, actionButton, className, ...inputProps }: FormFieldProps) {
    const hasChildren = !!children;

    return (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative flex items-center ">
                {hasChildren ? (
                    <div className="w-full ">{children}</div>
                ) : (
                    <>
                        {prefix && <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">{prefix}</span>}
                        <Input
                            id={id}
                            {...inputProps}
                            className={`pr-24 ${prefix ? 'pl-8' : ''} ${className ?? ''} ${error ? 'border-red-500' : ''}`}
                        />
                        {actionButton && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="absolute top-1/2 right-2 -translate-y-1/2 "
                                onClick={actionButton.onClick}
                                title={actionButton.title}
                            >
                                {actionButton.icon ?? actionButton.label}
                            </Button>
                        )}
                    </>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
