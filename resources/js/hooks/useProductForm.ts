import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { z, ZodError } from 'zod';
import { ProductData } from '../types/products';

const productSchema = z
    .object({
        product_name: z.string().trim().min(1, 'El nombre es requerido'),
        product_code: z.string().trim().min(1, 'El código es requerido'),
        category: z.string().trim().min(1, 'La categoría es requerida'),
        description: z.string().trim().min(1, 'La descripción es requerida'),
        price: z.number().gt(0, 'El precio debe ser mayor a 0'),
        stock: z.number().min(0),
        min_stock: z.number().min(0).gt(0, 'El stock mínimo debe ser mayor a 0'),
        max_stock: z.number().min(0).gt(0, 'El stock máximo debe ser mayor a 0'),
        ivaItem: z.number().min(0).max(100),
    })
    .refine((data) => data.max_stock >= data.min_stock, {
        path: ['max_stock'],
        message: 'El stock máximo debe ser mayor o igual al mínimo',
    });

const defaultData: ProductData = {
    product_name: '',
    product_code: '',
    category: '',
    tipo_item: 1,
    description: '',
    stock: 0,
    ivaItem: 0,
    price: 0,
    precioUni: 0,
    img_product: '',
    min_stock: 0,
    max_stock: 0,
    id: 0,
};

function toFormData(data: ProductData): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'img_product') {
                if (typeof value === 'string' && value.startsWith('data:image')) {
                    const blob = dataURItoBlob(value);
                    formData.append(key, blob, 'image.jpg');
                }
            } else {
                formData.append(key, value as string | Blob);
            }
        }
    });

    return formData;
}

function dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

function normalizeFormData(data: ProductData): ProductData {
    return {
        ...data,
        price: Number(data.price),
        ivaItem: Number((data.price - data.price / 1.13).toFixed(2)),
        stock: Number(data.stock),
        min_stock: Number(data.min_stock),
        max_stock: Number(data.max_stock),
        precioUni: Number((data.price / 1.13).toFixed(2)),
        tipo_item: Number(data.tipo_item),
        cantidad: data.cantidad ? Number(data.cantidad) : undefined,
    };
}

export function useProductForm(mode: 'create' | 'edit', initial?: Partial<ProductData>) {
    const isEdit = mode === 'edit';
    const [form, setForm] = useState<ProductData>({
        ...defaultData,
        ...initial,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProductData, string>>>({});

    const setField = useCallback(<K extends keyof ProductData>(key: K, value: ProductData[K]) => {
        setForm((prev) => {
            const updated = { ...prev, [key]: value };

            // Obtenemos los valores actualizados de price e ivaItem
            const price = key === 'price' ? Number(value) : Number(updated.price);

            // Calcular automáticamente ivaItem si cambia el precio
            if (key === 'price') {
                if (!isNaN(price)) {
                    updated.ivaItem = Number((price - price / 1.13).toFixed(2));
                    updated.precioUni = Number((price / 1.13).toFixed(2));
                }
            }
            return updated;
        });

        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const validate = useCallback((): boolean => {
        const normalized = normalizeFormData(form);
        const result = productSchema.safeParse(normalized);
        if (!result.success) {
            const err: typeof errors = {};
            (result.error as ZodError).issues.forEach((issue) => {
                const key = issue.path[0] as keyof ProductData;
                if (!err[key]) err[key] = issue.message;
            });
            setErrors(err);
            return false;
        }
        setErrors({});
        return true;
    }, [form]);

    const submit = useCallback(() => {
        if (!validate()) return;

        const formData = toFormData(form);
        const route = isEdit ? `/inventory/update/${form.product_code}` : '/inventory/store';

        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        router.post(route, formData, {
            preserveScroll: true,
            onError: () => {
                toast.error('Ups, algo salio mal, contacta a soporte');
            },
        });
    }, [form, validate, isEdit]);

    return { form, errors, setField, submit, isEdit };
}
