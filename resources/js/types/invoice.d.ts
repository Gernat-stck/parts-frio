import { Receiver } from './clientes';
import { Customer, Seller } from './invoice-persons';
import { ProductData } from './products';

export type ID = {
    version: number;
    ambiente: '01' | '00';
    tipoDte: string;
    numeroControl: string;
    codigoGeneracion: string;
    tipoModelo: 1 | 2;
    tipoOperacion: 1 | 2;
    tipoContingencia: number | null;
    motivoContin: string | null;
    fecEmi: string; // formato 'YYYY-MM-DD'
    horEmi: string; // formato 'HH:mm:ss'
    tipoMoneda: 'USD' | string;
};

export interface Emitter {
    codPuntoVentaMH?: string;
    codPuntoVenta?: string;
    codEstableMH?: string;
    codEstable?: string;
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
}

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
    tipoDTE: string;
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
// Tipo extendido para compatibilidad
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

export interface BodyDocument {
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
    psv?: number;
    noGravado?: number;
    ivaItem?: number;
    numeroDocumento:string | null;
    codTributo?: null;
}
interface Tributos {
    codigo: string;
    descripcion: string;
    valor: number;
}
export interface Resumen {
    totalNoSuj: number;
    totalExenta: number;
    totalGravada: number;
    subTotalVentas: number;
    descuNoSuj: number;
    descuExenta: number;
    descuGravada: number;
    porcentajeDescuento?: number;
    totalDescu: number;
    tributos?: Tributos[] | null;
    subTotal: number;
    ivaPerci1?: number;
    ivaRete1?: number;
    reteRenta?: number;
    montoTotalOperacion: number;
    totalNoGravado?: number;
    totalPagar?: number;
    totalLetras: string;
    totalIva?: number;
    saldoFavor?: number;
    condicionOperacion: number;
    pagos?: Payment['pagos'];
    numPagoElectronico?: null;
}
export interface InvoicePayload {
    identificacion: ID;
    emisor: Emitter;
    receptor: Receiver;
    cuerpoDocumento: BodyDocument[];
    resumen: Resumen;
    documentoRelacionado: DocumentoRelacionado[] | null;
    otrosDocumentos?: null;
    ventaTercero: VentaTercero | null;
    extension: null;
    apendice: null;
    [key: string]: unknown;
}
export interface ContingenciaPayload {
    selectedFacturas: Factura[];
    contingencyType: string;
    justification: string;
    fInicio: string;
    fFin: string;
    hInicio: string;
    hFin: string;
}

export interface DocumentoRelacionado {
    tipoDocumento: string;
    tipoGeneracion: number;
    numeroDocumento: string;
    fechaEmision: string;
}
export interface Apendice {
    campo: string;
    etiqueta: string;
    valor: string;
}

export interface VentaTercero {
    nit: string;
    nombre: string;
}
export interface CreditNotePayload {
    identificacion: ID;
    documentoRelacionado: DocumentoRelacionado[] | null;
    emisor: Emitter;
    receptor: Receiver;
    ventaTercero: VentaTercero | null;
    cuerpoDocumento: BodyDocument[];
    resumen: Resumen;
    ventaTercero: null;
    extension: null;
    apendice: Apendice[] | null;
    [key: string]: unknown;
}
