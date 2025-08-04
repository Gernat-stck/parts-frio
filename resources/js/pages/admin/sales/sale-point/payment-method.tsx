import PaymentStep from '@/components/invoice/payment-step';
import { INITIAL_PAYMENT } from '@/constants/salesConstants';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { CartItem, Payment } from '@/types/invoice';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
];

export default function PaymentMethod() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentData, setPaymentData] = useState<Payment>(INITIAL_PAYMENT);

    useEffect(() => {
        const raw = localStorage.getItem('cart');
        if (raw) {
            try {
                const parsed: CartItem[] = JSON.parse(raw);
                setCartItems(parsed);
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    const nextStep = () => {
        localStorage.setItem('payment', JSON.stringify(paymentData));
        router.get(route('admin.sales.invoice'));
    };

    const prevStep = () => {
        router.get(route('admin.sales.receiver'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Metodo de pago" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <PaymentStep data={paymentData} setData={setPaymentData} cartItems={cartItems} onNext={nextStep} onPrev={prevStep} />{' '}
            </main>
        </AppLayout>
    );
}
