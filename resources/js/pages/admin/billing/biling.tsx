import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturación',
        href: '/admin/billing',
    },
];

export default function Billing() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facturación" />
            <PlaceholderPattern />
        </AppLayout>
    );
}
