import { Factura } from '../data/factura-types';
import { CartItem, Payment } from '../types/invoice';

export function filtrarFacturas(facturas: Factura[], busqueda: string, estado: string) {
    const busquedaLimpia = busqueda.trim().toLowerCase();
    return facturas.filter((factura) => {
        const coincideBusqueda =
            factura.receptor.toLowerCase().includes(busquedaLimpia) ||
            factura.documentoReceptor.includes(busquedaLimpia) ||
            factura.codigoGeneracion?.toLowerCase().includes(busquedaLimpia);

        const coincideEstado = estado === 'todos' || factura.estado.toLowerCase() === estado;
        return coincideBusqueda && coincideEstado;
    });
}

export function buildResumen({
    documentType,
    subtotal,
    total,
    iva,
    cartItems,
    convertirNumeroALetras,
    paymentData,
}: {
    documentType: '01' | '03' | '05' ;
    subtotal: number;
    total: number;
    iva: number;
    cartItems: CartItem[]; // ajusta el tipo si tienes uno definido
    convertirNumeroALetras: (n: number) => string;
    paymentData: Payment
}) {
    const isFiscal = documentType === '03' || documentType === '05';

    const resumen: any = {
        totalNoSuj: 0.0,
        totalExenta: 0.0,
        totalGravada: Number(subtotal.toFixed(2)),
        subTotalVentas: Number(subtotal.toFixed(2)),
        descuNoSuj: 0.0,
        descuExenta: 0.0,
        descuGravada: 0.0,
        porcentajeDescuento: 0.0,
        totalDescu: Number(cartItems.reduce((total, item) => total + (item.montoDescu || 0), 0).toFixed(2)),
        subTotal: Number(subtotal.toFixed(2)),
        montoTotalOperacion: Number(total.toFixed(2)),
        totalNoGravado: 0.0,
        totalPagar: Number(total.toFixed(2)),
        totalLetras: convertirNumeroALetras(total),
        saldoFavor: 0.0,
        condicionOperacion: paymentData.condicionOperacion,
        pagos: paymentData.pagos,
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
        resumen.tributos = null
    }

    return resumen;
}
