import { X } from 'lucide-react'; // ícono de eliminación
import React, { useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ImageUploaderProps {
    value: string;
    onChange: (base64: string) => void;
    label?: string;
    name?: string;
    previewPath?: string;
    originalValue?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    label = 'Imagen del producto',
    name = 'img_product',
    previewPath = '/storage/products/',
    originalValue = '',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    onChange(evt.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        if (originalValue) {
            onChange(originalValue);
        } else {
            onChange('');
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const renderPreview = () => {
        const src = value.startsWith('data:image') ? value : `${previewPath}${value}`;
        return (
            <div className="relative h-28 w-28 overflow-hidden rounded-lg border shadow-sm">
                <img src={src} alt="Vista previa" className="h-full w-full object-cover" />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                    title="Quitar imagen"
                >
                    <X className="h-4 w-4 text-red-500" />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </Label>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-4">
                    {value && renderPreview()}
                    <div>
                        <Input id={name} type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="text-sm" />
                        <p className="mt-1 text-xs text-gray-500">Formatos permitidos: JPG, PNG, GIF. Máx: 2MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
