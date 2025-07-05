'use client';

import type React from 'react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    document: string;
    documentType: 'cedula' | 'ruc' | 'pasaporte';
}

interface CustomerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (customer: Customer) => void;
}

export function CustomerForm({ isOpen, onClose, onSubmit }: CustomerFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        document: '',
        documentType: 'cedula' as const,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                document: '',
                documentType: 'cedula',
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es requerida';
        }

        if (!formData.document.trim()) {
            newErrors.document = 'El documento es requerido';
        }

        if (!formData.documentType) {
            newErrors.documentType = 'El tipo de documento es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const customer: Customer = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            document: formData.document.trim(),
            documentType: formData.documentType,
        };

        onSubmit(customer);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="mx-4 max-h-[95vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Datos del Cliente</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="juan@ejemplo.com"
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="0999123456"
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="documentType">Tipo de Documento *</Label>
                            <Select
                                value={formData.documentType}
                                onValueChange={(value: 'cedula' | 'ruc' | 'pasaporte') => handleInputChange('documentType', value)}
                            >
                                <SelectTrigger className={errors.documentType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cedula">Cédula</SelectItem>
                                    <SelectItem value="ruc">RUC</SelectItem>
                                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.documentType && <p className="text-sm text-red-500">{errors.documentType}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document">Número de Documento *</Label>
                        <Input
                            id="document"
                            value={formData.document}
                            onChange={(e) => handleInputChange('document', e.target.value)}
                            placeholder="1234567890"
                            className={errors.document ? 'border-red-500' : ''}
                        />
                        {errors.document && <p className="text-sm text-red-500">{errors.document}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección *</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Dirección completa del cliente..."
                            rows={3}
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="flex flex-col justify-end gap-3 pt-4 sm:flex-row">
                        <Button type="button" variant="outline" onClick={onClose} className="order-2 bg-transparent sm:order-1">
                            Cancelar
                        </Button>
                        <Button type="submit" className="order-1 sm:order-2">
                            Generar Factura
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
