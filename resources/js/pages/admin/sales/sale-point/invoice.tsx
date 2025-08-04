import InvoiceStep from '@/components/invoice/invoice-preview-v2';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

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
export default function Invoice({ auth }: InvoiceProps) {
    console.log('Invoice', auth);

    const prevStep = () => {
        router.get(route('admin.sales.payment'));
    };
    const cartItems = [
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
    ];
    const customerData = {
        tipoDocumento: '',
        numDocumento: '',
        nombre: '',
        direccion: {
            departamento: '',
            municipio: '',
            complemento: '',
        },
        telefono: '',
        correo: '',
    };
    const paymentData = {
        condicionOperacion: 1,
        pagos: [
            {
                codigo: '01',
                montoPago: 0,
                referencia: '',
            },
        ],
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Factura" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <InvoiceStep cartItems={cartItems} customerData={customerData} paymentData={paymentData} onPrev={prevStep} />
            </main>
        </AppLayout>
    );
}
