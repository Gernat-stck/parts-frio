import { BodyDocument, CartItem, Payment, Resumen } from '../types/invoice';

export function buildResumen({
    documentType,
    subtotal,
    total,
    iva,
    cartItems,
    convertirNumeroALetras,
    paymentData,
    baseAmount,
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
    resumenFNc: Resumen | null;
}) {
    const isFiscal = documentType === '03';
    const resumen: Resumen = {
        totalNoSuj: 0.0,
        totalExenta: 0.0,
        totalGravada: isFiscal ? Number(baseAmount.toFixed(2)) : Number(subtotal.toFixed(2)),
        subTotalVentas: isFiscal ? Number(baseAmount.toFixed(2)) : Number(subtotal.toFixed(2)),
        descuNoSuj: 0.0,
        descuExenta: 0.0,
        descuGravada: 0.0,
        porcentajeDescuento: 0.0,
        totalDescu: Number(cartItems?.reduce((total, item) => total + (item.montoDescu || 0), 0).toFixed(2)),
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
const roundMoney = (num: number) => {
    const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
    return Math.abs(rounded) < 0.005 ? 0 : rounded;
};

export const calculateResumeTotals = (cuerpoDocumento: BodyDocument[]) => {
    let totalGravada = 0;
    let subTotalVentas = 0;
    let totalDescu = 0;

    cuerpoDocumento.forEach((item) => {
        const ventaGravada = parseFloat(item.ventaGravada as unknown as string) || 0;
        const montoDescu = parseFloat(item.montoDescu as unknown as string) || 0;
        const precioUni = parseFloat(item.precioUni as unknown as string) || 0;
        const cantidad = parseFloat(item.cantidad as unknown as string) || 0;

        totalGravada += ventaGravada;
        subTotalVentas += precioUni * cantidad;
        totalDescu += montoDescu;
    });

    const finalTotalGravada = roundMoney(totalGravada);
    const finalSubTotalVentas = roundMoney(subTotalVentas);
    const finalTotalDescu = roundMoney(totalDescu);

    // Aquí evitamos negativos fantasmas
    const subTotal = roundMoney(finalSubTotalVentas - finalTotalDescu);
    const totalIva = roundMoney(subTotal * 0.13);
    const totalPagar = roundMoney(subTotal + totalIva);

    return {
        totalGravada: finalTotalGravada,
        subTotalVentas: finalSubTotalVentas - finalTotalDescu,
        totalIva,
        totalDescu: finalTotalDescu,
        total: finalTotalGravada,
        totalPagar,
        montoTotalOperacion: finalTotalGravada,
        subTotal,
        tributos: [
            {
                codigo: '20',
                descripcion: 'Impuesto al Valor Agregado',
                valor: totalIva,
            },
        ],
    };
};
