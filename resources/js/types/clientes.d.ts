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