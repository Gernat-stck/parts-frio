// Tipos para facturas y productos
export interface ProductoFactura {
    nombre: string;
    cantidad: number;
    precio: number;
}

export interface DetallesFactura {
    productos: ProductoFactura[];
    subtotal: number;
    iva: number;
    total: number;
}

export interface Factura {
    id: number;
    fechaGeneracion: string;
    numeroControl: string;
    codigoGeneracion: string | null;
    documentoReceptor: string;
    receptor: string;
    monto: number;
    selloRecibido: string | null;
    estado: 'aceptado' | 'error' | 'rechazada' | 'anulada';
    detalles: DetallesFactura;
}
