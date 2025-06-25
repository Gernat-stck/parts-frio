import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { employeeNavItems } from '@/lib/nav-items';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturación',
        href: '/employee/billing',
    },
];

export default function Billing() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={employeeNavItems}>
            <Head title="Facturación" />
            <PlaceholderPattern />
        </AppLayout>
    );
}
