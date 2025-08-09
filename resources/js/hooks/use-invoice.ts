import { BodyDocument, CartItem, Payment, Resumen } from '../types/invoice';

export function buildResumen({
    documentType,
    subtotal,
    total,
    iva,
    cartItems,
    convertirNumeroALetras,
    paymentData,
    cuerpoDocumento,
    baseAmount,
    resumenFNc
}: {
    documentType: '01' | '03' | '05';
    subtotal: number;
    total: number;
    iva: number;
    cartItems: CartItem[]; // ajusta el tipo si tienes uno definido
    cuerpoDocumento?: BodyDocument[] | null;
    convertirNumeroALetras: (n: number) => string;
    paymentData: Payment;
    baseAmount: number;
    resumenFNc: Resumen | null
}) {
      if (resumenFNc) {
          return resumenFNc;
      }

    const isFiscal = documentType === '03';
    const isNotaCredito = documentType === '05';
    const carrito = isNotaCredito ? cuerpoDocumento : cartItems;
    const resumen: Resumen = {
        totalNoSuj: 0.0,
        totalExenta: 0.0,
        totalGravada: isFiscal ? Number(baseAmount.toFixed(2)) : Number(subtotal.toFixed(2)),
        subTotalVentas: isFiscal ? Number(baseAmount.toFixed(2)) : Number(subtotal.toFixed(2)),
        descuNoSuj: 0.0,
        descuExenta: 0.0,
        descuGravada: 0.0,
        porcentajeDescuento: 0.0,
        totalDescu: Number(carrito?.reduce((total, item) => total + (item.montoDescu || 0), 0).toFixed(2)),
        subTotal: isFiscal ? Number(baseAmount.toFixed(2)) : Number(subtotal.toFixed(2)),
        montoTotalOperacion: Number(total.toFixed(2)),
        totalNoGravado: 0.0,
        totalPagar: Number(total.toFixed(2)),
        totalLetras: convertirNumeroALetras(total),
        saldoFavor: 0.0,
        condicionOperacion: paymentData.condicionOperacion,
        pagos: paymentData.pagos.map((p) => ({
            ...p,
            montoPago: Number(total.toFixed(2)),
        })),

        numPagoElectronico: null,
    };

    if (isFiscal) {
        resumen.ivaPerci1 = 0.0;
        resumen.ivaRete1 = 0.0;
        resumen.reteRenta = 0.0;
        resumen.tributos = [
            {
                codigo: '20',
                descripcion: 'Impuesto al Valor Agregado',
                valor: Number(iva.toFixed(2)),
            },
        ];
        // totalIva no se incluye en fiscales
    } else {
        resumen.ivaRete1 = 0.0;
        resumen.reteRenta = 0.0;
        resumen.totalIva = Number(iva.toFixed(2));
        resumen.tributos = null;
    }

    return resumen;
}


/**
 * Calcula los totales para el resumen de una nota de crédito
 * basándose en los ítems del cuerpo del documento.
 *
 * @param cuerpoDocumento Un array de ítems del documento.
 * @returns Un objeto con los totales calculados y formateados.
 */
export const calculateResumeTotals = (cuerpoDocumento: BodyDocument[]) => {
    // Inicializar los acumuladores
    const totals = {
        totalGravada: 0,
        subTotalVentas: 0,
        totalIva: 0,
        totalDescu: 0,
        total: 0,
    };

    // Iterar sobre cada ítem en el cuerpo del documento
    cuerpoDocumento.forEach(item => {
        // Asegurarse de que los valores sean numéricos y manejar posibles nulos o undefined
        const ventaGravada = parseFloat(item.ventaGravada as unknown as string) || 0;
        const montoDescu = parseFloat(item.montoDescu as unknown as string) || 0;
        const precioUni = parseFloat(item.precioUni as unknown as string) || 0;
        const cantidad = parseFloat(item.cantidad as unknown as string) || 0;

        // Calcular el IVA y los demás totales
        const subtotalSinDescuento = precioUni * cantidad;
        const ivaItem = (subtotalSinDescuento - montoDescu) * 0.13; // 13% de IVA

        totals.totalGravada += ventaGravada;
        totals.subTotalVentas += subtotalSinDescuento;
        totals.totalDescu += montoDescu;
        totals.totalIva += ivaItem;
    });

    // Calcular el total final
    totals.total = totals.subTotalVentas + totals.totalIva - totals.totalDescu;

    // Retornar los totales formateados a dos decimales para precisión
    return {
        totalGravada: parseFloat(totals.totalGravada.toFixed(2)),
        subTotalVentas: parseFloat(totals.subTotalVentas.toFixed(2)),
        totalIva: parseFloat(totals.totalIva.toFixed(2)),
        totalDescu: parseFloat(totals.totalDescu.toFixed(2)),
        total: parseFloat(totals.total.toFixed(2)),
    };
};