import CreditNoteTabs from '@/components/invoice/credit-note';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { InvoicePayload } from '@/types/invoice';
import { Head } from '@inertiajs/react';

interface SalesHistoryProps {
    codigoGeneracion: string;
    originalInvoice: InvoicePayload;
}
export default function SalesHistory({ originalInvoice, codigoGeneracion }: SalesHistoryProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Historial de ventas',
            href: route('admin.sales.history'),
        },
        {
            title: 'Crear Nota de Crédito',
            href: route('admin.sales.show.credit.note', { codigoGeneracion: codigoGeneracion }),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Historial de ventas" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <CreditNoteTabs invoice={originalInvoice} />
            </main>
        </AppLayout>
    );
}
