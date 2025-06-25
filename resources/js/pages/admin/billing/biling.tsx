import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { adminNavItems } from '@/lib/nav-items';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturación',
        href: '/admin/billing',
    },
];

export default function Billing() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Facturación" />
            <PlaceholderPattern />
        </AppLayout>
    );
}
