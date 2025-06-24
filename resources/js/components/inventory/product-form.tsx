import type React from 'react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types/products';



interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'> | Product) => void;
    product?: Product | null;
    mode: 'create' | 'edit';
}

const categories = ['Electrónicos', 'Accesorios', 'Audio', 'Fotografía', 'Almacenamiento', 'Oficina', 'Gaming'];

export function ProductForm({ isOpen, onClose, onSubmit, product, mode }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        minStock: '',
        image: '',
        category: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (product && mode === 'edit') {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                minStock: product.minStock.toString(),
                image: product.image,
                category: product.category,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                minStock: '',
                image: '',
                category: '',
            });
        }
        setErrors({});
    }, [product, mode, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        }

        if (!formData.price || Number.parseFloat(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        if (!formData.stock || Number.parseInt(formData.stock) < 0) {
            newErrors.stock = 'El stock debe ser mayor o igual a 0';
        }

        if (!formData.minStock || Number.parseInt(formData.minStock) <= 0) {
            newErrors.minStock = 'El stock mínimo debe ser mayor a 0';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number.parseFloat(formData.price),
            stock: Number.parseInt(formData.stock),
            minStock: Number.parseInt(formData.minStock),
            image: formData.image || '/placeholder.svg?height=80&width=80',
            category: formData.category,
        };

        if (mode === 'edit' && product) {
            onSubmit({ ...productData, id: product.id });
        } else {
            onSubmit(productData);
        }

        onClose();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ej: Laptop Dell XPS 13"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Descripción detallada del producto..."
                            rows={3}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio ($) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="0.00"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Actual *</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                placeholder="0"
                                className={errors.stock ? 'border-red-500' : ''}
                            />
                            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minStock">Stock Mínimo *</Label>
                            <Input
                                id="minStock"
                                type="number"
                                min="1"
                                value={formData.minStock}
                                onChange={(e) => handleInputChange('minStock', e.target.value)}
                                placeholder="1"
                                className={errors.minStock ? 'border-red-500' : ''}
                            />
                            {errors.minStock && <p className="text-sm text-red-500">{errors.minStock}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">URL de Imagen (Opcional)</Label>
                        <Input
                            id="image"
                            type="url"
                            value={formData.image}
                            onChange={(e) => handleInputChange('image', e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">{mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
