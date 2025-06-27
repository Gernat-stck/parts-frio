import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import UserManagement from '@/components/users/user-management';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrar usuarios',
        href: '/admin/users',
    },
];

export default function Users({auth}: {auth: Auth}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Administrar usuarios" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <UserManagement auth={auth} />
            </main>
        </AppLayout>
    );
}
