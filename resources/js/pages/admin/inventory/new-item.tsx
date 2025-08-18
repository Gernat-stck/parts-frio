import ProductForm from '@/components/inventory/product-form';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventario',
        href: route('admin.inventory'),
    },
    {
        title: 'Nuevo Artículo',
        href: route('admin.inventory.create'),
    },
];

export default function NewItem({ categories }: { categories: string[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Crear nuevo producto" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-2">
                <ProductForm mode="create" categories={categories} />
            </main>
        </AppLayout>
    );
}
