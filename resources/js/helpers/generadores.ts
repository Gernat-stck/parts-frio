import { buildResumen } from '@/hooks/use-invoice';
import { BodyDocument, CreditNotePayload, Emitter, Resumen, VentaTercero } from '@/types/invoice.d';
import { v4 as uuidv4 } from 'uuid';
import { EMITTER_BASE, ID_BASE } from '../constants/companyConstants';
import { Receiver } from '../types/clientes';
import { CartItem, ContingenciaPayload, DocumentoRelacionado, ID, InvoicePayload, Payment } from '../types/invoice';

interface GenerateInvoiceDataParams {
    cartItems: CartItem[];
    customerData: Receiver;
    paymentData: Payment;
    dteType: string;
    documentoRelacionado?: DocumentoRelacionado[] | null;
    ventaTercero?: VentaTercero | null;
    cuerpoDocumento?: BodyDocument[] | null;
    resumen?: Resumen | null;
}

const camposOmitidos: (keyof ID)[] = [
    'tipoDte',
    'numeroControl',
    'tipoModelo',
    'tipoOperacion',
    'tipoContingencia',
    'motivoContin',
    'fecEmi',
    'horEmi',
    'tipoMoneda',
];
// Función auxiliar para calcular el resumen de los tributos
// Función auxiliar para construir el objeto de tributos para el resumen
const buildResumenTributos = (totalIva: number) => {
    if (totalIva > 0) {
        return [
            {
                codigo: '20',
                descripcion: 'Impuesto al Valor Agregado',
                valor: totalIva,
            },
        ];
    }
    return null;
};
/**
 * Omite las propiedades especificadas de un objeto.
 *
 * @param obj El objeto del cual se omitirán las propiedades.
 * @param keys Las claves de las propiedades a omitir.
 * @returns Un nuevo objeto sin las propiedades omitidas.
 */
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clone = { ...obj };
    keys.forEach((key) => delete clone[key]);
    return clone;
}

/**
 * Genera un código de generación (UUID v4) en mayúsculas, incluyendo los guiones.
 *
 * @returns {string} El UUID v4 en formato de 36 caracteres (e.g., "B869F9F1-6B7F-4A18-8E14-DD4E5603E901").
 */
export function generarCodigoGeneracion(): string {
    // Genera un UUID v4 con guiones y lo convierte a mayúsculas para cumplir con el esquema.
    return uuidv4().toUpperCase();
}

/** * Genera un número de control alfanumérico y numérico para DTE.
 *
 * @param tipoDTE El tipo de DTE para el cual se generará el número de control.
 * @returns {string} El número de control generado en el formato "DTE-{tipoDTE}-{alfanumerico}-{numerico}".
 */
export function generarNumeroControl(tipoDTE: string): string {
    const alfanumerico = Array.from({ length: 8 }, () =>
        Math.random()
            .toString(36)
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .charAt(0),
    ).join('');

    const numerico = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');

    return `DTE-${tipoDTE}-${alfanumerico}-${numerico}`;
}

/** * Convierte un objeto en FormData, manejando correctamente los tipos de datos y estructuras anidadas.
 *
 * @param obj El objeto a convertir.
 * @param form Un objeto FormData opcional para agregar los datos.
 * @param namespace Un prefijo opcional para las claves del FormData.
 * @returns {FormData} El objeto FormData resultante con los datos del objeto original.
 */
export function convertToFormData<T extends Record<string, unknown>>(obj: T, form: FormData = new FormData(), namespace = ''): FormData {
    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const value = obj[key];
        const formKey = namespace ? `${namespace}[${key}]` : key;

        if (value === null) {
            form.append(formKey, 'null');
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const nestedKey = `${formKey}[${index}]`;
                if (typeof item === 'object' && item !== null) {
                    convertToFormData(item as Record<string, unknown>, form, nestedKey);
                } else if (item === null) {
                    form.append(nestedKey, 'null');
                } else {
                    form.append(nestedKey, value instanceof Blob ? value : `${item}`);
                }
            });
        } else if (typeof value === 'object' && !(value instanceof File)) {
            convertToFormData(value as Record<string, unknown>, form, formKey);
        } else {
            form.append(formKey, value instanceof Blob ? value : `${value}`);
        }
    }

    return form;
}

/**
 * Construye el payload para la certificación de contingencia.
 * @param data Datos necesarios para construir el payload de contingencia.
 * @returns Un objeto que representa el payload de contingencia.
 */
export function buildContingencyPayload(data: ContingenciaPayload) {
    const now = new Date();
    const identificacion = {
        ...omit(ID_BASE, camposOmitidos),
        version: 3,
        codigoGeneracion: generarCodigoGeneracion(),
        fTransmision: now.toISOString().split('T')[0],
        hTransmision: now.toTimeString().split(' ')[0],
    };
    return {
        identificacion: identificacion,
        emisor: {
            nit: EMITTER_BASE.nit,
            nombre: EMITTER_BASE.nombre,
            nombreResponsable: EMITTER_BASE.nombre,
            tipoDocResponsable: '36', // NIT
            numeroDocResponsable: EMITTER_BASE.nit,
            tipoEstablecimiento: EMITTER_BASE.tipoEstablecimiento,
            codEstableMH: null,
            codPuntoVenta: null,
            telefono: EMITTER_BASE.telefono,
            correo: EMITTER_BASE.correo,
        },
        detalleDTE: data.selectedFacturas.map((factura, index) => ({
            noItem: index + 1,
            codigoGeneracion: factura.codigoGeneracion,
            tipoDoc: factura.tipoDTE, // Asignar un tipo de documento por defecto si no está definido
        })),
        motivo: {
            fInicio: data.fInicio, // Fecha de inicio de la contingencia
            fFin: data.fFin, // Fecha de fin de la contingencia
            hInicio: data.hInicio, // Hora de inicio de la contingencia
            hFin: data.hFin, // Hora de fin de la contingencia
            tipoContingencia: parseInt(data.contingencyType), // Convertir a número
            motivoContingencia: data.justification,
        },
    };
}
const convertirNumeroALetras = (numero: number): string => {
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    return `${entero} CON ${decimal}/100 DOLARES`;
};

/**
 * Construye el payload para la generacion de Factura consumidor final, nota de credito y credito fiscal
 * @param cartItems datos de los productos de la factura
 * @param customerData datos del receptor
 * @param paymentData datos del metodo de pago del receptor
 * @param dteType tipo de DTE para formatear de manera adecuada
 * @param documentoRelacionado Documento Relacionado en caso de nota de credito
 * @param ventaTercero  Opcion de agregar venta de tercero
 * @returns InvoicePayload para crear el formData de la solicitud
 */
export function generateInvoiceData({
    cartItems,
    customerData,
    paymentData,
    dteType,
    documentoRelacionado = null,
    ventaTercero = null,
    cuerpoDocumento = null,
    resumen = null,
}: GenerateInvoiceDataParams): InvoicePayload {
    const isNotaCredito = dteType === '05';

    const subtotal = isNotaCredito
        ? (resumen?.subTotal ?? 0)
        : cartItems.reduce((total, item) => {
              return total + (item.quantity * item.price - (item.montoDescu || 0));
          }, 0);

    const iva = subtotal * 0.13;
    const total = subtotal;

    const now = new Date();

    const codigoGeneracion = generarCodigoGeneracion();
    const numeroControl = generarNumeroControl(dteType);
    const prepareSchema = {
        identificacion: {
            ...ID_BASE,
            version: dteType === '01' ? 1 : dteType === '03' ? 3 : dteType === '05' ? 3 : 1,
            tipoDte: dteType,
            numeroControl,
            codigoGeneracion,
            fecEmi: now.toISOString().split('T')[0],
            horEmi: now.toTimeString().split(' ')[0],
        },
        emisor: EMITTER_BASE,
        receptor: { ...customerData },
        cuerpoDocumento: isNotaCredito
            ? (cuerpoDocumento ?? [])
            : cartItems.map((item, index) => {
                  const ventaGravada = Number((item.quantity * item.price - (item.montoDescu || 0)).toFixed(2));
                  const ivaItem = Number((ventaGravada * 0.13).toFixed(2));
                  const tributos = ['20'];

                  const baseItem = {
                      numItem: index + 1,
                      tipoItem: 1,
                      codigo: item.product_code,
                      descripcion: item.description,
                      cantidad: Number(item.quantity),
                      uniMedida: 99,
                      precioUni: Number(item.price.toFixed(2)),
                      montoDescu: Number(item.montoDescu?.toFixed(2)),
                      ventaNoSuj: 0.0,
                      ventaExenta: 0.0,
                      ventaGravada,
                      psv: 0.0,
                      noGravado: 0.0,
                      tributos,
                      numeroDocumento: null,
                      codTributo: null,
                  };

                  if (dteType !== '03' && dteType !== '05') {
                      return {
                          ...baseItem,
                          ivaItem,
                          tributos: null,
                      };
                  }

                  return baseItem; // para documentos fiscales: sin ivaItem
              }),

        resumen: buildResumen({
            documentType: dteType as '01' | '03' | '05',
            subtotal,
            total,
            iva,
            cartItems,
            cuerpoDocumento: isNotaCredito ? cuerpoDocumento : null,
            convertirNumeroALetras,
            paymentData,
        }),
        documentoRelacionado: isNotaCredito ? (documentoRelacionado ?? null) : null,
        otrosDocumentos: null,
        ventaTercero: isNotaCredito ? (ventaTercero ?? null) : null,
        extension: null,
        apendice: null,
    };
    return prepareSchema;
}


/**
 * Construye el payload para la certificación de Nota de Crédito.
 * @param data El objeto de datos inicial para la Nota de Crédito.
 * @returns Un objeto que representa el payload de la Nota de Crédito (DTE 05) validado.
 */
export function buildCreditNotePayload(data: CreditNotePayload): CreditNotePayload {
    const now = new Date();
    const codigoGeneracion = uuidv4().toUpperCase();
    const numeroControl = `DTE-05-${codigoGeneracion.substring(0, 8)}-${now.getTime()}`.substring(0, 31);

    // 1. Emisor: Se seleccionan solo los campos requeridos por el esquema
    const emisor: Emitter = {
        nit: EMITTER_BASE.nit,
        nrc: EMITTER_BASE.nrc,
        nombre: EMITTER_BASE.nombre,
        codActividad: EMITTER_BASE.codActividad,
        descActividad: EMITTER_BASE.descActividad,
        nombreComercial: EMITTER_BASE.nombreComercial,
        tipoEstablecimiento: EMITTER_BASE.tipoEstablecimiento,
        direccion: {
            departamento: EMITTER_BASE.direccion.departamento,
            municipio: EMITTER_BASE.direccion.municipio,
            complemento: EMITTER_BASE.direccion.complemento,
        },
        telefono: EMITTER_BASE.telefono,
        correo: EMITTER_BASE.correo,
    };

    // 2. Cuerpo del Documento: Se eliminan los campos 'psv' y 'noGravado'
    const cuerpoDocumento: BodyDocument[] = data.cuerpoDocumento.map((item) => {
        const { psv, noGravado, ...rest } = item;
        const tributos = item.ventaGravada > 0 ? item.tributos : null;

        return {
            ...rest,
            tributos,
            numeroDocumento: item.numeroDocumento,
            codTributo: item.codTributo,
        };
    });

    // 3. Resumen: Se eliminan campos no válidos y se añaden los obligatorios
    const resumen: Resumen = {
        totalNoSuj: data.resumen.totalNoSuj,
        totalExenta: data.resumen.totalExenta,
        totalGravada: data.resumen.totalGravada,
        subTotalVentas: data.resumen.subTotalVentas,
        descuNoSuj: data.resumen.descuNoSuj,
        descuExenta: data.resumen.descuExenta,
        descuGravada: data.resumen.descuGravada,
        totalDescu: data.resumen.totalDescu,
        // **CORRECCIÓN:** Se calcula y añade el array de tributos al resumen
        tributos: buildResumenTributos(data.resumen.totalIva || 0),
        subTotal: data.resumen.subTotal,
        ivaPerci1: data.resumen.ivaPerci1 || 0,
        ivaRete1: data.resumen.ivaRete1 || 0,
        reteRenta: data.resumen.reteRenta || 0,
        montoTotalOperacion: data.resumen.montoTotalOperacion,
        totalLetras: data.resumen.totalLetras || convertirNumeroALetras(data.resumen.montoTotalOperacion),
        condicionOperacion: data.resumen.condicionOperacion,
    };

    // 4. Se asegura de que todos los campos de nivel superior estén presentes.
    return {
        identificacion: {
            version: 3,
            ambiente: data.identificacion.ambiente,
            tipoDte: '05',
            numeroControl: data.identificacion.numeroControl,
            codigoGeneracion: data.identificacion.codigoGeneracion,
            tipoModelo: 1,
            tipoOperacion: 1,
            tipoContingencia: null,
            motivoContin: null,
            fecEmi: now.toISOString().split('T')[0],
            horEmi: now.toTimeString().split(' ')[0].substring(0, 8),
            tipoMoneda: 'USD',
        },
        documentoRelacionado: data.documentoRelacionado,
        emisor,
        receptor: data.receptor,
        cuerpoDocumento,
        resumen,
        ventaTercero: data.ventaTercero,
        extension: null,
        apendice: null,
    };
}
