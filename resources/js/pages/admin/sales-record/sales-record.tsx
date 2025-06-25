import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { adminNavItems } from '@/lib/nav-items';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial de ventas',
        href: '/admin/sales-record',
    },
];

export default function SalesRecord() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Historial de ventas" />
            <PlaceholderPattern />
        </AppLayout>
    );
}