export interface Seller {
    id: string;
    name: string;
    email: string;
    commission: number;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    document: string;
    documentType: 'cedula' | 'ruc' | 'pasaporte' | 'DUI' | 'NIT';
}
