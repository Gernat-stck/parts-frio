import type { Factura } from './factura-types';

// Datos mock de facturas para pruebas y desarrollo
export const facturasMock: Factura[] = [
    {
        id: 1,
        fechaGeneracion: '2024-01-15',
        codigoGeneracion: 'DTE-001-2024-000001',
        documentoReceptor: '12345678-9',
        puntoVenta: '001',
        receptor: 'Juan Pérez García',
        monto: 150.75,
        estado: 'Certificada',
        detalles: {
            productos: [
                { nombre: 'Producto A', cantidad: 2, precio: 50.0 },
                { nombre: 'Producto B', cantidad: 1, precio: 50.75 },
            ],
            subtotal: 150.75,
            iva: 0,
            total: 150.75,
        },
    },
    {
        id: 2,
        fechaGeneracion: '2024-01-16',
        codigoGeneracion: null,
        documentoReceptor: '98765432-1',
        puntoVenta: '002',
        receptor: 'María López Rodríguez',
        monto: 275.5,
        estado: 'Contingencia',
        detalles: {
            productos: [{ nombre: 'Servicio X', cantidad: 1, precio: 275.5 }],
            subtotal: 275.5,
            iva: 0,
            total: 275.5,
        },
    },
    {
        id: 3,
        fechaGeneracion: '2024-01-17',
        codigoGeneracion: 'DTE-001-2024-000003',
        documentoReceptor: '11223344-5',
        puntoVenta: '001',
        receptor: 'Carlos Mendoza Silva',
        monto: 89.25,
        estado: 'Certificada',
        detalles: {
            productos: [{ nombre: 'Producto C', cantidad: 3, precio: 29.75 }],
            subtotal: 89.25,
            iva: 0,
            total: 89.25,
        },
    },
    {
        id: 4,
        fechaGeneracion: '2024-01-18',
        codigoGeneracion: null,
        documentoReceptor: '55667788-9',
        puntoVenta: '003',
        receptor: 'Ana Fernández Torres',
        monto: 320.0,
        estado: 'Contingencia',
        detalles: {
            productos: [{ nombre: 'Producto D', cantidad: 4, precio: 80.0 }],
            subtotal: 320.0,
            iva: 0,
            total: 320.0,
        },
    },
];
