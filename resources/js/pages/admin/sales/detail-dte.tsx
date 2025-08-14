import { DynamicInvoice } from '@/components/invoice/dynamic-invoice';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { InvoicePayload } from '@/types/invoice';
import { Head } from '@inertiajs/react';
import { Download, MailCheckIcon } from 'lucide-react';

interface SalesHistoryProps {
    codigoGeneracion: string;
    invoiceData: InvoicePayload;
}
export default function DetailDte({ invoiceData, codigoGeneracion }: SalesHistoryProps) {
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
                <ScrollArea className="h-[80vh]">
                    <div className="mx-auto w-full max-w-7xl space-y-2">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row">
                                <Button type="submit" className="flex-1 sm:flex-none">
                                    <MailCheckIcon className="mr-2 h-4 w-4" />
                                    Enviar por correo
                                </Button>
                                <Button type="button" variant="outline" className="flex-1 sm:flex-none">
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar
                                </Button>
                            </div>
                            <div className="mt-2 w-full">
                                <DynamicInvoice invoiceData={invoiceData} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </main>
        </AppLayout>
    );
}
