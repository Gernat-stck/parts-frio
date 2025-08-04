import { Customer, Seller } from './invoice-persons';
import { ProductData } from './products';

export interface Sale {
    id: string;
    date: string;
    seller: Seller;
    customer: Customer;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'completed' | 'pending';
}

export interface CartItem extends ProductData {
    quantity: number;
    subtotal: number;
}
interface Pago {
    codigo: string;
    montoPago: number;
    referencia: string;
    periodo: string | null;
    plazo: string | null;
}

export interface Payment {
    condicionOperacion: number;
    pagos: Pago[];
}

export interface InvoicePayload {
    identificacion: {
        version: number;
        ambiente: string;
        tipoDte: string;
        numeroControl: string;
        codigoGeneracion: string;
        tipoModelo: number;
        tipoOperacion: number;
        tipoContingencia: string | null;
        motivoContin: string | null;
        fecEmi: string;
        horEmi: string;
        tipoMoneda: string;
    };
    emisor: {
        codPuntoVentaMH: string;
        codPuntoVenta: string;
        codEstableMH: string;
        codEstable: string;
        nombreComercial: string;
        tipoEstablecimiento: string;
        nit: string;
        nrc: string;
        nombre: string;
        codActividad: string;
        descActividad: string;
        direccion: {
            departamento: string;
            municipio: string;
            complemento: string;
        };
        telefono: string;
        correo: string;
    };
    receptor: Receiver & {
        nrc: string | null;
        codActividad: string | null;
        descActividad: string | null;
    };
    cuerpoDocumento: Array<{
        numItem: number;
        tipoItem: number;
        codigo: string;
        descripcion: string;
        cantidad: number;
        uniMedida: number;
        precioUni: number;
        montoDescu: number;
        ventaNoSuj: number;
        ventaExenta: number;
        ventaGravada: number;
        tributos?: Array<unknown> | null;
        psv: number;
        noGravado: number;
        ivaItem?: number;
        numeroDocumento: null;
        codTributo?: null;
    }>;
    resumen: {
        totalNoSuj: number;
        totalExenta: number;
        totalGravada: number;
        subTotalVentas: number;
        descuNoSuj: number;
        descuExenta: number;
        descuGravada: number;
        porcentajeDescuento: number;
        totalDescu: number;
        tributos: Array<unknown> | null;
        subTotal: number;
        ivaPerci1?: number;
        ivaRete1: number;
        reteRenta: number;
        montoTotalOperacion: number;
        totalNoGravado: number;
        totalPagar: number;
        totalLetras: string;
        totalIva: number;
        saldoFavor: number;
        condicionOperacion: number;
        pagos: Payment['pagos'];
        numPagoElectronico: null;
    };
    documentoRelacionado: null;
    otrosDocumentos: null;
    ventaTercero: null;
    extension: null;
    apendice: null;
    [key: string]: unknown;
}
