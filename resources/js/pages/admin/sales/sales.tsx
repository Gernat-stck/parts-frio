import SalesDashboard from '@/components/sales/sales-dashboard';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Punto de venta',
        href: route('admin.sales'),
    },
];

interface CreateSalesProps {
    auth: Auth;
}
export default function CreateSale({ auth }: CreateSalesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Punto de Venta" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <SalesDashboard auth={auth} />
            </main>
        </AppLayout>
    );
}
