import InventoryDashboard from '@/components/inventory/inventory-dashboard';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Product } from '../../../types/products';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventario',
        href: 'admin.inventory',
    },
];

export default function Inventory({ auth, products }: { auth: Auth; products: {data: Product[]} }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Inventario" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <InventoryDashboard auth={auth} inventoryData={products.data} />
            </main>
        </AppLayout>
    );
}
