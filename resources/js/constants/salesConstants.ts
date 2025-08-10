import { Receiver } from '../types/clientes';
import { Payment } from '../types/invoice';

interface options {
    value: string;
    label: string;
}
export const PAYMENTS_METHODS: options[] = [
    { value: '01', label: 'Billetes y Monedas' },
    { value: '02', label: 'Tarjeta Débito' },
    { value: '03', label: 'Tarjeta Crédito' },
    { value: '04', label: 'Cheque' },
    { value: '05', label: 'Transferencia / Depósito Bancario' },
    { value: '08', label: 'Dinero Electrónico' },
    { value: '09', label: 'Monedero Electrónico' },
    { value: '11', label: 'Bitcoin' },
    { value: '12', label: 'Otras Criptomonedas' },
    { value: '13', label: 'Cuentas por pagar del receptor' },
    { value: '14', label: 'Giro Bancario' },
    { value: '99', label: 'Otros' },
];
export const INITIALIZER_RECEIVER: Receiver = {
    tipoDocumento: '',
    numDocumento: '',
    nombre: '',
    nit: '',
    nrc: '',
    codActividad: '',
    descActividad: '',
    nombreComercial: '',
    direccion: {
        departamento: '',
        municipio: '',
        complemento: '',
    },
    telefono: '',
    correo: '',
};
export const CONTINGENCY_TYPES: options[] = [
    { value: '1', label: 'No disponibilidad de sistema MH' },
    { value: '2', label: 'No disponibilidad del emisor' },
    { value: '3', label: 'Falla disponibilidad de Internet' },
    { value: '4', label: 'Falla en suministro electrico' },
    { value: '5', label: 'Otro' },
];
export const DTE_TYPES: options[] = [
    { value: '01', label: 'Factura Consumidor Final' },
    { value: '03', label: 'Crédito Fiscal' },
];
export type DteTypeValue = (typeof DTE_TYPES)[number]['value'];

export const INITIAL_PAYMENT: Payment = {
    condicionOperacion: 1,
    pagos: [
        {
            codigo: '01',
            montoPago: 0,
            referencia: '',
            periodo: null,
            plazo: null,
        },
    ],
};
export const PAYMENT_TYPE: options[] = [
    { value: '01', label: 'Billetes y monedas' },
    { value: '02', label: 'Tarjeta Debito' },
    { value: '03', label: 'Tarjeta Credito' },
    { value: '04', label: 'Cheque' },
    { value: '05', label: 'Transferencia-Deposito Bancario' },
    { value: '08', label: 'Dinero Electronico' },
    { value: '09', label: 'Monedero Electronico' },
    { value: '11', label: 'Bitcoin' },
    { value: '12', label: 'Otras Criptomonedas' },
    { value: '13', label: 'Cuentas por pagar del receptor' },
    { value: '14', label: 'Giro Bancario' },
    { value: '99', label: 'Otro (Indicar medio de pago)' },
];
export const TRIBUTOS_OPTIONS: options[] = [
    { value: '20', label: 'Impuesto sobre el Valor Agregado (IVA)' },
    { value: 'A8', label: 'Impuesto Especial al Combustible' },
    { value: '57', label: 'Impuesto Industria de Cemento' },
    { value: '90', label: 'Billetes y monedas' },
    { value: 'D4', label: 'Otros impuestos casos especiales' },
    { value: 'D5', label: 'Otras tasas casos especiales' },
    { value: 'A6', label: 'Impuestos ad-valorem, armas de fuego, municiones explosivas y articulos similares' },
];

export const PLAZO_OPTIONS: options[] = [
    { value: '01', label: 'Dias' },
    { value: '02', label: 'Meses' },
    { value: '03', label: 'Años' },
];

export const OTHER_DOCUMENTS_ASOCIATED: options[] = [
    { value: '1', label: 'Emisor' },
    { value: '2', label: 'Receptor' },
    { value: '3', label: 'Medico (Solo para contribuyentes de F-958)' },
    { value: '4', label: 'Transporte (Aplica solo Factura de exportacion)' },
];
export const DEPARTAMENTS: options[] = [
    { value: '01', label: 'Ahuachapán' },
    { value: '02', label: 'Santa Ana' },
    { value: '03', label: 'Sonsonate' },
    { value: '04', label: 'Chalatenango' },
    { value: '05', label: 'La Libertad' },
    { value: '06', label: 'San Salvador' },
    { value: '07', label: 'Cuscatlán' },
    { value: '08', label: 'La Paz' },
    { value: '09', label: 'Cabañas' },
    { value: '10', label: 'San Vicente' },
    { value: '11', label: 'Usulután' },
    { value: '12', label: 'San Miguel' },
    { value: '13', label: 'Morazán' },
    { value: '14', label: 'La Unión' },
];

export const DOCUMENTS_TYPES: options[] = [
    { value: '13', label: 'DUI' },
    { value: '36', label: 'NIT' },
    { value: '02', label: 'Carnet de Residente' },
    { value: '03', label: 'Pasaporte' },
    { value: '37', label: 'Otro' },
];

export const MUNICIPALITIES_BY_DEPARTMENT: Record<string, { value: string; label: string }[]> = {
    '01': [
        { value: '13', label: 'AHUACHAPAN NORTE' },
        { value: '14', label: 'AHUACHAPAN CENTRO' },
        { value: '15', label: 'AHUACHAPAN SUR' },
    ],
    '02': [
        { value: '14', label: 'SANTA ANA NORTE' },
        { value: '15', label: 'SANTA ANA CENTRO' },
        { value: '16', label: 'SANTA ANA ESTE' },
        { value: '17', label: 'SANTA ANA OESTE' },
    ],
    '03': [
        { value: '17', label: 'SONSONATE NORTE' },
        { value: '18', label: 'SONSONATE CENTRO' },
        { value: '19', label: 'SONSONATE ESTE' },
        { value: '20', label: 'SONSONATE OESTE' },
    ],
    '04': [
        { value: '34', label: 'CHALATENANGO NORTE' },
        { value: '35', label: 'CHALATENANGO CENTRO' },
        { value: '36', label: 'CHALATENANGO SUR' },
    ],
    '05': [
        { value: '23', label: 'LA LIBERTAD NORTE' },
        { value: '24', label: 'LA LIBERTAD CENTRO' },
        { value: '25', label: 'LA LIBERTAD OESTE' },
        { value: '26', label: 'LA LIBERTAD ESTE' },
        { value: '27', label: 'LA LIBERTAD COSTA' },
        { value: '28', label: 'LA LIBERTAD SUR' },
    ],
    '06': [
        { value: '20', label: 'SAN SALVADOR NORTE' },
        { value: '21', label: 'SAN SALVADOR OESTE' },
        { value: '22', label: 'SAN SALVADOR ESTE' },
        { value: '23', label: 'SAN SALVADOR CENTRO' },
        { value: '24', label: 'SAN SALVADOR SUR' },
    ],
    '07': [
        { value: '17', label: 'CUSCATLAN NORTE' },
        { value: '18', label: 'CUSCATLAN SUR' },
    ],
    '08': [
        { value: '23', label: 'LA PAZ OESTE' },
        { value: '24', label: 'LA PAZ CENTRO' },
        { value: '25', label: 'LA PAZ ESTE' },
    ],
    '09': [
        { value: '10', label: 'CABAÑAS OESTE' },
        { value: '11', label: 'CABAÑAS ESTE' },
    ],
    '10': [
        { value: '14', label: 'SAN VICENTE NORTE' },
        { value: '15', label: 'SAN VICENTE SUR' },
    ],
    '11': [
        { value: '24', label: 'USULUTAN NORTE' },
        { value: '25', label: 'USULUTAN ESTE' },
        { value: '26', label: 'USULUTAN OESTE' },
    ],
    '12': [
        { value: '21', label: 'SAN MIGUEL NORTE' },
        { value: '22', label: 'SAN MIGUEL CENTRO' },
        { value: '23', label: 'SAN MIGUEL OESTE' },
    ],
    '13': [
        { value: '27', label: 'MORAZAN NORTE' },
        { value: '28', label: 'MORAZAN SUR' },
    ],
    '14': [
        { value: '19', label: 'LA UNION NORTE' },
        { value: '20', label: 'LA UNION SUR' },
    ],
};
