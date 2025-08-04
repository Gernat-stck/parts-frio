import type { Customer } from './invoice-persons';

export interface Compra {
    fecha: string;
    factura: string;
    monto: number;
    productos: string[];
}

// Cliente extiende Customer y agrega campos específicos de tu app
export interface Cliente extends Customer {
    id: number;
    fechaRegistro: string;
    totalCompras: number;
    montoTotal: number;
    historialCompras: Compra[];
}

export interface Receiver {
    tipoDocumento?: string;
    numDocumento?: string;
    nombre: string;
    nit?: string | null; // Añadido para CCF/NC
    nrc?: string | null; // Añadido para CCF/NC
    codActividad: string | null; // Añadido para CCF/NC
    descActividad: string | null; // Añadido para CCF/NC
    nombreComercial?: string | null; // Añadido para CCF/NC
    direccion: {
        departamento: string;
        municipio: string;
        complemento: string;
    };
    telefono: string;
    correo: string;
}
