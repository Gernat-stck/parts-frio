import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DashboardV3 from '../../components/widgets/financial-widget';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Dashboard" />
            <ScrollArea className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <DashboardV3 />
            </ScrollArea>
        </AppLayout>
    );
}
