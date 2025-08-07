import { Emitter, ID } from '../types/invoice';
const convertToNull = (value : any) => (value === 'null' ? null : value);

export const ID_BASE: ID = {
    version: 1,
    ambiente: import.meta.env.VITE_HACIENDA_ENVIRONMENT || '01',
    tipoDte: '',
    numeroControl: '',
    codigoGeneracion: '',
    tipoModelo: 1,
    tipoOperacion: 1,
    tipoContingencia: null,
    motivoContin: null,
    fecEmi: '',
    horEmi: '',
    tipoMoneda: 'USD',
};


export const EMITTER_BASE: Emitter = {
    codPuntoVentaMH: convertToNull(import.meta.env.VITE_COD_PUNTO_VENTA_MH),
    codPuntoVenta: convertToNull(import.meta.env.VITE_COD_PUNTO_VENTA),
    codEstableMH: convertToNull(import.meta.env.VITE_COD_ESTABLE_MH),
    codEstable: convertToNull(import.meta.env.VITE_COD_ESTABLE),
    nombreComercial: import.meta.env.VITE_NOMBRE_COMERCIAL,
    tipoEstablecimiento: import.meta.env.VITE_TIPO_ESTABLECIMIENTO,
    nit: import.meta.env.VITE_NIT,
    nrc: import.meta.env.VITE_NRC,
    nombre: import.meta.env.VITE_NOMBRE,
    codActividad: import.meta.env.VITE_COD_ACTIVIDAD,
    descActividad: import.meta.env.VITE_DESC_ACTIVIDAD,
    direccion: {
        departamento: import.meta.env.VITE_DEPTO,
        municipio: import.meta.env.VITE_MUNI,
        complemento: import.meta.env.VITE_COMPLEMENTO,
    },
    telefono: import.meta.env.VITE_TELEFONO,
    correo: import.meta.env.VITE_CORREO,
};
