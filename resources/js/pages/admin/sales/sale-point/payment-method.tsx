import PaymentStep from '@/components/invoice/payment-step';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
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
];

interface PaymentMethodProps {
    auth: Auth;
}
export default function PaymentMethod({ auth }: PaymentMethodProps) {
    const [cartItems] = useState([
        {
            codigo: 'A101714',
            descripcion: 'Coca-Cola Normal Lata 12 Oz',
            cantidad: 2,
            precioUni: 0.82,
            montoDescu: 0.16,
        },
        {
            codigo: 'B0000404',
            descripcion: 'Bebida De La Granja Sabor Naranja 500Ml',
            cantidad: 1,
            precioUni: 1.05,
            montoDescu: 0.0,
        },
    ]);

    const [paymentData, setPaymentData] = useState({
        condicionOperacion: 1,
        pagos: [
            {
                codigo: '01',
                montoPago: 0,
                referencia: '',
            },
        ],
    });

    console.log('PaymentMethod', auth);
    const nextStep = () => {
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
