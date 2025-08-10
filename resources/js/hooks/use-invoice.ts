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
export const calculateResumeTotals = (cuerpoDocumento: BodyDocument[]) => {
    // Inicializar los acumuladores con precisión decimal
    let totalGravada = 0;
    let subTotalVentas = 0;
    let totalDescu = 0;

    // Iterar sobre cada ítem para acumular los totales
    cuerpoDocumento.forEach((item) => {
        // Asegurarse de que los valores sean numéricos
        const ventaGravada = parseFloat(item.ventaGravada as unknown as string) || 0;
        const montoDescu = parseFloat(item.montoDescu as unknown as string) || 0;
        const precioUni = parseFloat(item.precioUni as unknown as string) || 0;
        const cantidad = parseFloat(item.cantidad as unknown as string) || 0;
        // Acumular la venta gravada del ítem sin restarle el descuento
        totalGravada += ventaGravada;
        // Acumular el subtotal de las ventas (precio * cantidad) sin el descuento
        subTotalVentas += precioUni * cantidad;
        // Acumular el total de descuentos de todos los ítems
        totalDescu += montoDescu;
        // Calcular el IVA del ítem basado en la venta gravada (después de descuento)
        // Se utiliza el impuesto del 13% para el IVA
    });

    // Redondear los valores acumulados al final
    const finalTotalGravada = parseFloat(totalGravada.toFixed(2));
    const finalSubTotalVentas = parseFloat(subTotalVentas.toFixed(2));
    const finalTotalDescu = parseFloat(totalDescu.toFixed(2));

    // Calcular los totales finales del resumen
    const subTotal = finalSubTotalVentas - finalTotalDescu;
    const montoTotalOperacion = (subTotal * 13) / 100;
    const totalPagar = montoTotalOperacion;

    // Retornar el objeto con todos los valores formateados
    return {
        totalGravada: finalTotalGravada,
        subTotalVentas: subTotal,
        totalIva: (subTotal * 13) / 100,
        totalDescu: finalTotalDescu,
        total: finalTotalGravada,
        totalPagar: totalPagar,
        montoTotalOperacion: finalTotalGravada,
        subTotal: subTotal,
        tributos: [
            {
                codigo: '20',
                descripcion: 'Impuesto al Valor Agregado',
                valor: (subTotal * 13) / 100,
            },
        ],
    };
};
