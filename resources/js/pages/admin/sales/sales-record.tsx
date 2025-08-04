import GestionClientes from '@/components/sales/sales-record';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Cliente } from '../../../types/clientes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial de clientes',
        href: route('admin.sales.record'),
    },
];

export default function SalesRecord({ clientRecord }: { clientRecord: { data: Cliente[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Historial de ventas por clientes" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <GestionClientes clientRecord={clientRecord.data} />
            </main>
        </AppLayout>
    );
}
