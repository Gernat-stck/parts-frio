import ProductForm from '@/components/inventory/product-form';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Product } from '@/types/products';
import { Head } from '@inertiajs/react';

interface EditItemProps {
    product_code?: string;
    product: {data: Product};
    categories: string[];
}
export default function EditItem({ product_code, product, categories }: EditItemProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Inventario',
            href: route('admin.inventory'),
        },
        {
            title: 'Editar Artículo',
            href: route('admin.inventory.edit', { id: product_code }),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Editar producto" />
            <main className="container mx-auto h-[calc(100vh-5rem)]">
                <ProductForm mode="edit" initialData={product.data} categories={categories} />
            </main>
        </AppLayout>
    );
}
