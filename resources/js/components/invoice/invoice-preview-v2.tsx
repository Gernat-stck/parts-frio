import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Mail, PrinterIcon as Print } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface InvoiceStepProps {
    cartItems: any[];
    customerData: any;
    paymentData: any;
    onPrev: () => void;
}

export default function InvoiceStep({ cartItems, customerData, paymentData, onPrev }: InvoiceStepProps) {
    const generateInvoiceData = () => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.cantidad * item.precioUni - item.montoDescu);
        }, 0);

        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        const now = new Date();
        const codigoGeneracion = `${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
        const numeroControl = `DTE-01-S026P002-${now.getFullYear()}${String(Math.floor(Math.random() * 1000000000000000)).padStart(15, '0')}`;

        return {
            identificacion: {
                version: 1,
                ambiente: '01',
                tipoDte: '01',
                numeroControl,
                codigoGeneracion,
                tipoModelo: 1,
                tipoOperacion: 1,
                tipoContingencia: null,
                motivoContin: null,
                fecEmi: now.toISOString().split('T')[0],
                horEmi: now.toTimeString().split(' ')[0],
                tipoMoneda: 'USD',
            },
            emisor: {
                codPuntoVentaMH: 'P002',
                codPuntoVenta: 'P002',
                codEstableMH: 'S026',
                codEstable: 'S026',
                nombreComercial: 'Farmacia San Nicolas S.A. de C.V.',
                tipoEstablecimiento: '01',
                nit: '06142212650014',
                nrc: '4065',
                nombre: 'Farmacia San Nicolas S.A. de C.V.',
                codActividad: '46491',
                descActividad: 'Venta de productos farmacéuticos y medicinales',
                direccion: {
                    departamento: '05',
                    municipio: '01',
                    complemento: 'Blvd. Final Orden de Malta',
                },
                telefono: '22785417',
                correo: 'santaelena@sannicolas.com.sv',
            },
            receptor: customerData,
            cuerpoDocumento: cartItems.map((item, index) => ({
                numItem: index + 1,
                tipoItem: 1,
                codigo: item.codigo,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                uniMedida: 99,
                precioUni: item.precioUni,
                montoDescu: item.montoDescu,
                ventaNoSuj: 0.0,
                ventaExenta: 0.0,
                ventaGravada: item.cantidad * item.precioUni - item.montoDescu,
                tributos: null,
                psv: 0.0,
                noGravado: 0.0,
                ivaItem: (item.cantidad * item.precioUni - item.montoDescu) * 0.13,
                numeroDocumento: null,
                codTributo: null,
            })),
            resumen: {
                totalNoSuj: 0.0,
                totalExenta: 0.0,
                totalGravada: subtotal,
                subTotalVentas: subtotal,
                descuNoSuj: 0.0,
                descuExenta: 0.0,
                descuGravada: 0.0,
                porcentajeDescuento: 0.0,
                totalDescu: cartItems.reduce((total, item) => total + item.montoDescu, 0),
                tributos: null,
                subTotal: subtotal,
                ivaRete1: 0.0,
                reteRenta: 0.0,
                montoTotalOperacion: total,
                totalNoGravado: 0.0,
                totalPagar: total,
                totalLetras: convertirNumeroALetras(total),
                totalIva: iva,
                saldoFavor: 0.0,
                condicionOperacion: paymentData.condicionOperacion,
                pagos: paymentData.pagos,
                numPagoElectronico: null,
            },
        };
    };

    const convertirNumeroALetras = (numero: number): string => {
        const entero = Math.floor(numero);
        const decimal = Math.round((numero - entero) * 100);
        return `${entero} CON ${decimal}/100 DOLARES`;
    };

    const invoiceData = generateInvoiceData();

    const formasPago: { [key: string]: string } = {
        '01': 'EFECTIVO',
        '02': 'TARJETA DE CREDITO',
        '03': 'TARJETA DE DEBITO',
        '04': 'CHEQUE',
        '05': 'TRANSFERENCIA BANCARIA',
        '06': 'DEPOSITO BANCARIO',
        '99': 'OTROS',
    };

    return (
        <ScrollArea className="h-full w-full">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Factura Electrónica</CardTitle>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div>Farmacia San Nicolas S.A. de C.V.</div>
                            <div>NIT: 06142212650014 | NRC: 4065</div>
                            <div>Blvd. Final Orden de Malta</div>
                            <div>Tel: 22785417 | santaelena@sannicolas.com.sv</div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Document Info */}
                        <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2 dark:bg-gray-700/50">
                            <div>
                                <div className="text-sm font-semibold">Número de Control:</div>
                                <div className="font-mono text-xs">{invoiceData.identificacion.numeroControl}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">Código de Generación:</div>
                                <div className="font-mono text-xs break-all">{invoiceData.identificacion.codigoGeneracion}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">Fecha:</div>
                                <div className="text-sm">{invoiceData.identificacion.fecEmi}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">Hora:</div>
                                <div className="text-sm">{invoiceData.identificacion.horEmi}</div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h3 className="mb-2 font-semibold">Datos del Cliente</h3>
                            <div className="space-y-1 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-500/40">
                                <div>
                                    <strong>Nombre:</strong> {customerData.nombre}
                                </div>
                                <div>
                                    <strong>Documento:</strong> {customerData.numDocumento}
                                </div>
                                <div>
                                    <strong>Dirección:</strong> {customerData.direccion.complemento}
                                </div>
                                <div>
                                    <strong>Teléfono:</strong> {customerData.telefono}
                                </div>
                                {customerData.correo && (
                                    <div>
                                        <strong>Email:</strong> {customerData.correo}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h3 className="mb-2 font-semibold">Detalle de Productos</h3>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-500/50">
                                        <tr>
                                            <th className="border-b p-2 text-left">Código</th>
                                            <th className="border-b p-2 text-left">Descripción</th>
                                            <th className="border-b p-2 text-right">Cant.</th>
                                            <th className="border-b p-2 text-right">Precio</th>
                                            <th className="border-b p-2 text-right">Desc.</th>
                                            <th className="border-b p-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2 font-mono text-xs">{item.codigo}</td>
                                                <td className="p-2">{item.descripcion}</td>
                                                <td className="p-2 text-right">{item.cantidad}</td>
                                                <td className="p-2 text-right">${item.precioUni.toFixed(2)}</td>
                                                <td className="p-2 text-right">${item.montoDescu.toFixed(2)}</td>
                                                <td className="p-2 text-right font-semibold">
                                                    ${(item.cantidad * item.precioUni - item.montoDescu).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-80 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${invoiceData.resumen.subTotalVentas.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Descuentos:</span>
                                    <span>-${invoiceData.resumen.totalDescu.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>IVA (13%):</span>
                                    <span>${invoiceData.resumen.totalIva.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total a Pagar:</span>
                                    <span>${invoiceData.resumen.totalPagar.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-600">{invoiceData.resumen.totalLetras}</div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                            <h3 className="mb-2 font-semibold">Información de Pago</h3>
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{formasPago[paymentData.pagos[0].codigo]}</div>
                                        {paymentData.pagos[0].referencia && (
                                            <div className="text-sm text-gray-600">Ref: {paymentData.pagos[0].referencia}</div>
                                        )}
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        PAGADO
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button variant="outline" onClick={onPrev} className="flex-1 bg-transparent">
                        Volver al Pago
                    </Button>
                    <Button className="flex-1">
                        <Print className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar por Email
                    </Button>
                </div>

                {/* JSON Preview (for development) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Datos JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="dark:bg-accent p-4 max-h-60 overflow-auto rounded bg-gray-100 text-xs">
                            {JSON.stringify(invoiceData, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}
