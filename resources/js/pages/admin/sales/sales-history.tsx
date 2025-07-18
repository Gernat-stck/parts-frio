import HistorialFacturas from '@/components/sales/sales-history';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial de ventas',
        href: route('admin.sales.history'),
    },
];

export default function SalesHistory() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Historial de ventas" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <HistorialFacturas />
            </main>
        </AppLayout>
    );
}
