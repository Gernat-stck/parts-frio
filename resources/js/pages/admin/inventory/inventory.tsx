import InventoryDashboard from '@/components/inventory/inventory-dashboard';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventario',
        href: 'admin.inventory',
    },
];

export default function Inventory({ auth }: { auth: Auth }) {
    console.log(auth);
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Inventario" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <InventoryDashboard auth={auth} />
            </main>
        </AppLayout>
    );
}
