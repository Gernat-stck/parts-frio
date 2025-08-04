import ClientFormStep from '@/components/client/client-form';
import { INITIALIZER_RECEIVER } from '@/constants/salesConstants';
import AppLayout from '@/layouts/app-layout';
import { adminNavItems } from '@/lib/nav-items';
import { type BreadcrumbItem } from '@/types';
import { Receiver } from '@/types/clientes';
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
];
const allowedTypes = ['01', '03', '05'] as const;
type DocumentType = (typeof allowedTypes)[number]; // '01' | '03' | '05'

function isDocumentType(value: unknown): value is DocumentType {
    return typeof value === 'string' && allowedTypes.includes(value as DocumentType);
}

export default function ReceiverForm() {
    const [customerData, setCustomerData] = useState<Receiver>(INITIALIZER_RECEIVER);
    // Cargar datos del cliente desde localStorage al iniciar el componente
    useEffect(() => {
        const storedClient = localStorage.getItem('client');
        if (storedClient) {
            setCustomerData(JSON.parse(storedClient) as Receiver);
        }
    }, []);
    
    const nextStep = (cleanedData: Receiver) => {
        localStorage.setItem('client', JSON.stringify(cleanedData));
        router.get(route('admin.sales.payment'));
    };

    const prevStep = () => {
        setCustomerData(INITIALIZER_RECEIVER);
        router.get(route('admin.sales'));
    };
    const rawTypeDte = localStorage.getItem('typeDte');
    const typeDte: DocumentType | undefined = isDocumentType(rawTypeDte) ? rawTypeDte : undefined;
    return (
        <AppLayout breadcrumbs={breadcrumbs} mainNavItems={adminNavItems}>
            <Head title="Datos Receptor" />
            <main className="container mx-auto h-[calc(100vh-5rem)] p-5">
                <ClientFormStep data={customerData} setData={setCustomerData} onNext={nextStep} onPrev={prevStep} documentType={typeDte} />
            </main>
        </AppLayout>
    );
}
