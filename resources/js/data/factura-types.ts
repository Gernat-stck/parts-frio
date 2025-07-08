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
    codigoGeneracion: string | null;
    documentoReceptor: string;
    puntoVenta: string;
    receptor: string;
    monto: number;
    estado: 'Certificada' | 'Contingencia' | 'Anulada';
    detalles: DetallesFactura;
}
