import GestionClientes from '@/components/sales/sales-record';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial de clientes',
        href: route('admin.sales.record'),
    },
];
export default function SalesRecord() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Historial de ventas por clientes" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-2">
                <GestionClientes />
            </main>
        </AppLayout>
    );
}
