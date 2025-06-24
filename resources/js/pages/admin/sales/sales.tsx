import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crear venta',
        href: '/admin/market-car',
    },
];

export default function CreateSale() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear venta" />
            <PlaceholderPattern />
        </AppLayout>
    );
}
