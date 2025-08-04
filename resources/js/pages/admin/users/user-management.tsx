import UserManagement from '@/components/users/user-management';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Employee } from '../../../types/employee';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrar usuarios',
        href: '/admin/users',
    },
];

interface UserManagementProps {
    auth: Auth;
    employees: { data: Employee[] };
}

export default function Users({ auth, employees }: UserManagementProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Administrar usuarios" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <UserManagement auth={auth} employee={employees.data} />
            </main>
        </AppLayout>
    );
}
