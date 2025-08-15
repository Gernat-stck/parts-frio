import { buildResumen } from '@/hooks/use-invoice';
import { AnulacionData, BodyDocument, CreditNotePayload, Emitter, Factura, Resumen, Tributos, VentaTercero } from '@/types/invoice.d';
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
interface AnulationProps {
    invoice: Factura;
    formData: AnulacionData;
    tipoAnulacion: number;
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

const buildResumenTributos = (totalIva: number): Tributos[] | null => {
    if (totalIva > 0) {
        return [
            {
                codigo: '20',
                descripcion: 'Impuesto al Valor Agregado',
                valor: Number(totalIva.toFixed(2)),
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
export const convertirNumeroALetras = (numero: number): string => {
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    return `${entero} CON ${decimal}/100 DOLARES`;
};

// Función para formatear un número a dos decimales
const formatNumber = (num: number, dec?: number): number => {
    return Number(num.toFixed(dec || 2));
};
export function calculatedTotalsForResume(cartItems: CartItem[]) {
    return cartItems.reduce(
        (acc, item) => {
            const iva = item.price - item.price / 1.13;
            const totalPrice = item.price * item.quantity;
            const baseAmount = (item.price - item.ivaItem) * item.quantity;
            const ivaAmount = iva * item.quantity;

            acc.subtotal += baseAmount;
            acc.iva += ivaAmount;
            acc.total += totalPrice;
            acc.baseAmount += baseAmount;

            return acc;
        },
        { subtotal: 0, iva: 0, total: 0, baseAmount: 0 },
    );
}
/**
 * Obtener la fecha y hora en la zona horaria de El Salvador (UTC-6) de forma robusta
 * @returns
 */
export function getDateTime() {
    const elSalvadorFormatter = new Intl.DateTimeFormat('sv-SV', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/El_Salvador',
    });

    const parts = elSalvadorFormatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const hour = parts.find((p) => p.type === 'hour')?.value;
    const minute = parts.find((p) => p.type === 'minute')?.value;
    const second = parts.find((p) => p.type === 'second')?.value;

    const fecEmi = `${year}-${month}-${day}`;
    const horEmi = `${hour}:${minute}:${second}`;

    return { fecEmi, horEmi };
}
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
    const isFiscal = dteType === '05' || dteType === '03';
    const calculatedTotals = calculatedTotalsForResume(cartItems);

    // Formatear los totales
    calculatedTotals.subtotal = formatNumber(calculatedTotals.subtotal);
    calculatedTotals.iva = formatNumber(calculatedTotals.iva);
    calculatedTotals.total = formatNumber(calculatedTotals.total);
    calculatedTotals.baseAmount = formatNumber(calculatedTotals.baseAmount);

    const dateTime = getDateTime();
    const fecEmi = dateTime.fecEmi;
    const horEmi = dateTime.horEmi;

    const codigoGeneracion = generarCodigoGeneracion();
    const numeroControl = generarNumeroControl(dteType);
    const prepareSchema = {
        identificacion: {
            ...ID_BASE,
            version: dteType === '01' ? 1 : dteType === '03' ? 3 : dteType === '05' ? 3 : 1,
            tipoDte: dteType,
            numeroControl,
            codigoGeneracion,
            fecEmi: fecEmi,
            horEmi: horEmi,
        },
        emisor: EMITTER_BASE,
        receptor: { ...customerData },
        cuerpoDocumento: isNotaCredito
            ? (cuerpoDocumento ?? [])
            : cartItems.map((item, index) => {
                  // Precios sin IVA
                  const tributos = ['20'];
                  const iva = item.price - item.price / 1.13;

                  // Calcular los totales del ítem
                  const totalItemPriceWithIva = formatNumber(item.quantity * item.price);
                  const baseAmount = item.price - iva;
                  const totalItemIva = formatNumber(iva * item.quantity);
                  const totalItemPriceWithoutIva = formatNumber(item.quantity * baseAmount);

                  // Se utilizan los valores ya calculados
                  const montoDescu = formatNumber(item.montoDescu || 0);
                  const baseItem = {
                      numItem: index + 1,
                      tipoItem: formatNumber(item.tipo_item || 1),
                      codigo: item.product_code,
                      descripcion: item.description,
                      cantidad: formatNumber(item.quantity),
                      uniMedida: formatNumber(item.uniMedida || 99),
                      precioUni: isFiscal ? formatNumber(baseAmount, 3) : formatNumber(item.price), // Precio por unidad sin IVA
                      montoDescu,
                      ventaNoSuj: formatNumber(item.ventaNoSuj || 0),
                      ventaExenta: formatNumber(item.ventaExenta || 0),
                      ventaGravada: isFiscal ? totalItemPriceWithoutIva : totalItemPriceWithIva, // Total del ítem sin IVA ni descuentos
                      psv: formatNumber(item.psv || 0),
                      noGravado: formatNumber(item.noGravado || 0),
                      tributos: tributos || null,
                      numeroDocumento: null,
                      codTributo: null,
                  };

                  if (!isFiscal) {
                      return {
                          ...baseItem,
                          ivaItem: totalItemIva, // Total de IVA para este ítem
                          tributos: null,
                      };
                  }
                  return baseItem;
              }),
        resumen: buildResumen({
            documentType: dteType as '01' | '03' | '05',
            subtotal: calculatedTotals.total,
            total: calculatedTotals.total,
            iva: calculatedTotals.iva,
            cartItems,
            convertirNumeroALetras,
            paymentData,
            baseAmount: calculatedTotals.baseAmount,
            resumenFNc: resumen ? resumen : null,
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
    const numeroDocumento = data?.documentoRelacionado?.[0]?.numeroDocumento;
    const date = getDateTime();
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { psv, noGravado, ivaItem, ...rest } = item;
        const tributos = item.ventaGravada > 0 ? item.tributos : null;

        return {
            ...rest,
            tributos,
            numeroDocumento: numeroDocumento || null,
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
        tributos: buildResumenTributos(data.resumen.totalIva || 0),
        subTotal: data.resumen.subTotal,
        ivaPerci1: data.resumen.ivaPerci1 || 0,
        ivaRete1: data.resumen.ivaRete1 || 0,
        reteRenta: data.resumen.reteRenta || 0,
        montoTotalOperacion: data.resumen.montoTotalOperacion,
        totalLetras: convertirNumeroALetras(data.resumen.montoTotalOperacion),
        condicionOperacion: data.resumen.condicionOperacion,
    };

    // 4. Se asegura de que todos los campos de nivel superior estén presentes.
    return {
        identificacion: {
            version: 3,
            ambiente: data.identificacion.ambiente,
            tipoDte: '05',
            numeroControl: generarNumeroControl('05'),
            codigoGeneracion: generarCodigoGeneracion(),
            tipoModelo: 1,
            tipoOperacion: 1,
            tipoContingencia: null,
            motivoContin: null,
            fecEmi: date.fecEmi,
            horEmi: date.horEmi,
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

/**
 * Construye el payload para la anulacion de Factura.
 * @param invoice invoice datos de la factura a anular
 * @param tipoAnulacion tipo de anulacion a realizar
 * @param formData datos del formulario de anulacion
 * @return Un objeto que representa el payload de la anulacion de Factura.
 */
export function generateAnulacionPayload({ invoice, formData, tipoAnulacion }: AnulationProps) {
    const now = getDateTime();
    const fecAnula = now.fecEmi;
    const horAnula = now.horEmi;

    return {
        identificacion: {
            version: 2,
            ambiente: ID_BASE.ambiente,
            codigoGeneracion: generarCodigoGeneracion(),
            fecAnula,
            horAnula,
        },
        emisor: {
            nit: EMITTER_BASE.nit,
            nombre: EMITTER_BASE.nombre,
            tipoEstablecimiento: EMITTER_BASE.tipoEstablecimiento,
            nomEstablecimiento: EMITTER_BASE.nombreComercial,
            codEstableMH: EMITTER_BASE.codEstableMH,
            codEstable: EMITTER_BASE.codEstable,
            codPuntoVentaMH: EMITTER_BASE.codPuntoVentaMH,
            codPuntoVenta: EMITTER_BASE.codPuntoVenta,
            telefono: EMITTER_BASE.telefono,
            correo: EMITTER_BASE.correo,
        },
        documento: {
            tipoDte: invoice.tipoDTE,
            codigoGeneracion: invoice.codigoGeneracion,
            selloRecibido: invoice.selloRecibido,
            numeroControl: invoice.numeroControl,
            fecEmi: invoice.fechaGeneracion.split(' ')[0],
            montoIva: Number.parseFloat(invoice.detallesFactura.iva.toFixed(2)),
            codigoGeneracionR: tipoAnulacion === 2 ? null : formData.codigoGeneracionR,
            tipoDocumento: formData.tipoDocumento,
            numDocumento: formData.numDocumento,
            nombre: formData.nombre,
            telefono: formData.telefono,
            correo: formData.correo,
        },
        motivo: {
            tipoAnulacion,
            motivoAnulacion: formData.motivoAnulacion,
            nombreResponsable: formData.nombreResponsable,
            tipDocResponsable: formData.tipoDocResponsable,
            numDocResponsable: formData.numDocResponsable,
            nombreSolicita: formData.nombreSolicita,
            tipDocSolicita: formData.tipoDocSolicita,
            numDocSolicita: formData.numDocSolicita,
        },
    };
}
