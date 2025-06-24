import AppLayout from '@/layouts/app-layout';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import InventoryDashboard from '../../../components/inventory/inventory-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventario',
        href: '/admin/inventory',
    },
];

export default function Inventory({ auth }: { auth: Auth }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventario" />
            <main className="container mx-auto h-[calc(100vh-12rem)] p-4">
                <InventoryDashboard auth={auth} />
            </main>
        </AppLayout>
    );
}
