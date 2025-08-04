import InvoiceStep from '@/components/invoice/invoice-preview-v2';
import { INITIAL_PAYMENT, INITIALIZER_RECEIVER } from '@/constants/salesConstants';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Receiver } from '@/types/clientes';
import { CartItem, Payment } from '@/types/invoice';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Punto de venta',
        href: route('admin.sales'),
    },
    {
        title: 'Datos Receptor',
        href: route('admin.sales.receiver'),
    },
    {
        title: 'Metodo de pago',
        href: route('admin.sales.payment'),
    },
    {
        title: 'Factura',
        href: route('admin.sales.invoice'),
    },
];

interface InvoiceProps {
    auth: Auth;
}

function loadFromLocalStorage<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return null;
    }
}
export default function Invoice({ auth }: InvoiceProps) {
    const [cartItems] = useState<CartItem[]>(() => loadFromLocalStorage<CartItem[]>('cart') || []);
    const [customerData] = useState<Receiver>(() => loadFromLocalStorage<Receiver>('client') || INITIALIZER_RECEIVER);
    const [paymentData] = useState<Payment>(() => loadFromLocalStorage<Payment>('payment') || INITIAL_PAYMENT);
    const prevStep = () => {
        router.get(route('admin.sales.payment'));
    };
    console.log(auth)
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Factura" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <InvoiceStep cartItems={cartItems} customerData={customerData} paymentData={paymentData} onPrev={prevStep} />
            </main>
        </AppLayout>
    );
}
