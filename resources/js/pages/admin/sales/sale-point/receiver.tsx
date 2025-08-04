import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ClientFormStep from '../../../../components/client/client-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Punto de venta',
        href: route('admin.sales'),
    },
    {
        title: 'Datos Receptor',
        href: route('admin.sales.receiver'),
    },
];

interface ReceiverFormProps {
    auth: Auth;
}
export default function ReceiverForm({ auth }: ReceiverFormProps) {
    const [customerData, setCustomerData] = useState({
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
    });

    console.log('ReceiverForm', auth);
    const nextStep = () => {
        router.get(route('admin.sales.payment'));
    };

    const prevStep = () => {
        router.get(route('admin.sales'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Datos Receptor" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <ClientFormStep data={customerData} setData={setCustomerData} onNext={nextStep} onPrev={prevStep} />
            </main>
        </AppLayout>
    );
}
