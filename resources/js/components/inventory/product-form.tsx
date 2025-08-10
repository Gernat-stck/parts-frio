import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProductForm } from '@/hooks/useProductForm';
import { Edit3, Plus, Save, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ProductData } from '../../types/products';
import { DecimalField } from '../decimal-field';
import { FormField } from '../form-field';
import { ImageUploader } from '../image-uploader';
import { NumericField } from '../numeric-field';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CategorySelect } from './category-select';
import { StockStatus } from './stock-status';

function generateProductCode(productName: string): string {
    // Extraer letras significativas del nombre
    const cleaned = productName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '') // solo letras y números
        .slice(0, 3); // máximo 3 caracteres

    const prefix = cleaned.padEnd(3, 'X'); // rellena si es corto
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3 dígitos

    return `${prefix}${randomNumber}`;
}

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export default function ProductForm(props: {
    mode: 'create' | 'edit';
    initialData?: Partial<ProductData>;
    onCancel?: () => void;
    isLoading?: boolean;
    categories?: string[];
}) {
    const { form, errors, setField, submit, isEdit } = useProductForm(props.mode, props.initialData);
    const [customCategories, setCustomCategories] = useState<string[]>([]);

    return (
        <div className="w-full">
            <Card className="w-full border-0 shadow-none">
                <CardHeader className="px-3 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-2 sm:items-center">
                            <div className="flex-shrink-0">
                                {isEdit ? <Edit3 className="h-5 w-5 sm:h-6 sm:w-6" /> : <Plus className="h-5 w-5 sm:h-6 sm:w-6" />}
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-lg sm:text-xl">{isEdit ? 'Editar Producto' : 'Crear Producto'}</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    {isEdit ? 'Actualiza la información existente' : 'Completa los datos para un nuevo producto'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button disabled={props.isLoading} type="submit" onClick={submit} className="w-full sm:w-auto">
                                {props.isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span className="ml-2">{isEdit ? 'Actualizar' : 'Crear'}</span>
                            </Button>
                            {props.onCancel && (
                                <Button variant="outline" onClick={props.onCancel} className="w-full bg-transparent sm:w-auto">
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-3 sm:px-6">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Básicos */}
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            <FormField
                                id="product_name"
                                label="Nombre *"
                                value={form.product_name}
                                onChange={(e) => setField('product_name', e.target.value)}
                                error={errors.product_name}
                                placeholder="Ingresa el nombre del producto"
                            />
                            <FormField
                                id="product_code"
                                label="Código *"
                                value={form.product_code}
                                onChange={(e) => setField('product_code', e.target.value)}
                                error={errors.product_code}
                                actionButton={{
                                    icon: <Wand2 className="h-4 w-4" />,
                                    title: 'Generar código',
                                    onClick: () => setField('product_code', generateProductCode(form.product_name)),
                                }}
                                placeholder="Ingresa o genera un código único"
                            />
                        </div>

                        {/* Categoría & Tipo */}
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            <CategorySelect
                                value={form.category}
                                onChange={(val) => setField('category', val)}
                                custom={customCategories}
                                onAddCustom={(cat) => {
                                    const formatted = capitalize(cat);
                                    if (![...(props.categories ?? []), ...customCategories].includes(formatted)) {
                                        setCustomCategories((prev) => [...prev, formatted]);
                                        toast.success(`Categoría "${formatted}" agregada con éxito.`);
                                    }
                                    setField('category', formatted);
                                }}
                                allStatic={props.categories ?? []}
                                error={errors.category}
                            />

                            <FormField id="tipo_item" label="Tipo de Ítem" error={errors.tipo_item}>
                                <Select value={form.tipo_item.toString()} onValueChange={(val) => setField('tipo_item', Number(val))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Bienes o Producto</SelectItem>
                                        <SelectItem value="2">Servicios</SelectItem>
                                        <SelectItem value="3">Bienes y Servicios</SelectItem>
                                        <SelectItem value="4">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        {/* Descripción */}
                        <div>
                            <Label htmlFor="description" className="text-sm font-medium">
                                Descripción *
                            </Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Ingresa una descripción detallada del producto"
                            />
                            {errors.description && <p className="text-xs text-red-500 sm:text-sm">{errors.description}</p>}
                        </div>

                        {/* Precio & IVA */}
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                            <DecimalField
                                id="price"
                                label="Precio con IVA *"
                                value={Number.parseFloat(Number(form.price).toFixed(2))}
                                setValue={(val) => setField('price', val)}
                                error={errors.price}
                                prefix="$"
                            />

                            <FormField
                                id="ivaItem"
                                label="IVA (13%)"
                                type="number"
                                step={0.01}
                                value={(form.price -(form.price/1.13)).toFixed(2)}
                                disabled
                                prefix="$"
                                error={errors.ivaItem}
                            />

                            <FormField
                                id="precioUni"
                                label="Precio sin IVA"
                                type="number"
                                step={0.01}
                                value={(form.price/1.13).toFixed(2)}
                                disabled
                                prefix="$"
                                error={errors.precioUni}
                            />
                        </div>

                        {/* Stock */}
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                            <NumericField
                                id="stock"
                                label="Stock Actual"
                                value={form.stock}
                                setValue={(val) => setField('stock', val)}
                                error={errors.stock}
                                placeholder="Stock actual"
                            />

                            <NumericField
                                id="min_stock"
                                label="Stock Mínimo"
                                value={form.min_stock}
                                setValue={(val) => setField('min_stock', val)}
                                error={errors.min_stock}
                                placeholder="Stock mínimo"
                            />

                            <NumericField
                                id="max_stock"
                                label="Stock Máximo"
                                value={form.max_stock}
                                setValue={(val) => setField('max_stock', val)}
                                error={errors.max_stock}
                                placeholder="Stock máximo"
                            />
                        </div>

                        {/* Imagen */}
                        <div className="grid grid-cols-2 space-y-1">
                            <ImageUploader
                                value={form.img_product}
                                onChange={(base64) => setField('img_product', base64)}
                                originalValue={props.initialData?.img_product || ''}
                                label="Imagen del producto"
                                name="img_product"
                                previewPath="/private/"
                            />

                            {/* Estado de Stock */}
                            <div className="flex items-end justify-end">
                                {/* Added flex, items-end, justify-end */}
                                <StockStatus stock={form.stock} min={form.min_stock} />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
