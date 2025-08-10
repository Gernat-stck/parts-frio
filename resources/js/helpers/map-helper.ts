import { BodyDocument } from '../types/invoice';
import { ProductData } from '../types/products';

/**
 * Mapea un objeto ProductData a la estructura de un BodyDocument.
 * Asume que los datos numéricos ya han sido normalizados.
 *
 * @param product El objeto ProductData.
 * @param numItem El número de ítem secuencial.
 * @returns El objeto BodyDocument transformado.
 */
export function mapProductToBodyDocument(product: ProductData, numItem: number): BodyDocument {
    const ventaGravada = ((product.cantidad || 1) * (product.price / 1.13)).toFixed(2);
    return {
        numItem: numItem,
        tipoItem: product.tipo_item,
        codigo: product.product_code,
        descripcion: product.product_name,
        cantidad: product.cantidad || 1,
        uniMedida: product.uniMedida || 99,
        precioUni: product.precioUni,
        montoDescu: product.montoDescu || 0,
        ventaNoSuj: product.ventaNoSuj || 0,
        ventaExenta: product.ventaExenta || 0,
        ventaGravada: Number(product.ventaGravada) || Number(ventaGravada),
        tributos: ['20'],
        psv: product.psv || 0,
        noGravado: product.noGravado || 0,
        ivaItem: product.ivaItem,
        numeroDocumento: null,
        codTributo: null,
    };
}

/**
 * Normaliza campos numéricos que se reciben como strings de una API.
 * @param data El array de objetos a normalizar.
 * @param keysToNormalize Un array de las claves (propiedades) que deben ser convertidas a números.
 * @returns Un nuevo array con los objetos normalizados.
 */
export function normalizeNumericFields<T>(data: T[], keysToNormalize: Array<keyof T>): T[] {
    return data.map((item) => {
        const newItem = { ...item };
        for (const key of keysToNormalize) {
            // Asegurarse de que el valor existe y es un string antes de intentar la conversión
            if (typeof newItem[key] === 'string' || typeof newItem[key] === 'number') {
                (newItem[key] as unknown) = Number(newItem[key]);
            }
        }
        return newItem;
    });
}
