import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { convertToFormData, generateInvoiceData } from '@/helpers/generadores';
import { getPaymentLabel } from '@/helpers/get-labels';
import type { Receiver } from '@/types/clientes';
import type { CartItem, InvoicePayload, Payment } from '@/types/invoice';
import { Link, router, usePage } from '@inertiajs/react';
import { Award, Download, FilePlus2Icon, Mail, PrinterIcon as Print } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import LoaderCute from '../loader/loader-page';
import { ScrollArea } from '../ui/scroll-area';

interface InvoiceStepProps {
    cartItems: CartItem[];
    customerData: Receiver;
    paymentData: Payment;
    onPrev: () => void;
}

export default function InvoiceStep({ cartItems, customerData, paymentData, onPrev }: InvoiceStepProps) {
    const dteType = localStorage.getItem('typeDte') || '01';
    const page = usePage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const invoiceData: InvoicePayload = generateInvoiceData({ cartItems, customerData, paymentData, dteType });
    const onCertificate = () => {
        if (!dteType) {
            toast.error('Tipo de DTE no encontrado en localStorage');
            console.error('Tipo de DTE no encontrado en localStorage');
            return;
        }
        const formData = convertToFormData(invoiceData);
        setIsLoading(true);
        console.log(isLoading);
        router.post(route('admin.save.invoice', { tipoDte: dteType }), formData, {
            onFinish: () => {
                // Verifica si hay errores en la respuesta
                if (page.props?.errors || page.props?.error) {
                    console.warn('Error al guardar factura, localStorage no se limpia');
                    setIsLoading(false);
                    return;
                }
                // Si no hay errores, limpia el localStorage
                localStorage.removeItem('cart');
                localStorage.removeItem('client');
                localStorage.removeItem('payment');
                localStorage.removeItem('typeDte');
                setIsLoading(false);
            },
        });
    };
    if (isLoading) {
        return <LoaderCute description="Estamos validando informacion con hacienda, espera un momento." />;
    }
    return (
        <div className="flex h-full w-full flex-col">
            {!isLoading && (
                <ScrollArea className="h-[80vh]">
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4 p-2 sm:space-y-6 sm:p-4">
                            {/* Actions - Responsive */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                                <Button variant="outline" onClick={onPrev} className="w-full bg-transparent sm:flex-1">
                                    Volver al Pago
                                </Button>
                                <Button className="hover w-full border bg-yellow-50 text-black hover:bg-yellow-300 sm:flex-1" onClick={onCertificate}>
                                    <Award className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Certificar</span>
                                    <span className="sm:hidden">Cert.</span>
                                </Button>
                                <Link href={route('admin.sales')} className="w-full bg-transparent sm:flex-1">
                                    <Button variant="outline" type='button' className="w-full bg-transparent sm:flex-1">
                                        <FilePlus2Icon />
                                        Generar Nueva venta 
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full bg-transparent sm:flex-1">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Descargar PDF</span>
                                    <span className="sm:hidden">PDF</span>
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent sm:flex-1">
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Enviar por Email</span>
                                    <span className="sm:hidden">Email</span>
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent sm:flex-1">
                                    <Print className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Imprimir</span>
                                    <span className="sm:hidden">Print</span>
                                </Button>
                            </div>

                            <Card>
                                <CardHeader className="pb-4 text-center">
                                    <CardTitle className="text-lg sm:text-2xl">Factura Electrónica</CardTitle>
                                    <div className="space-y-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                        <div className="font-medium">Farmacia San Nicolas S.A. de C.V.</div>
                                        <div>NIT: 06142212650014 | NRC: 4065</div>
                                        <div>Blvd. Final Orden de Malta</div>
                                        <div>Tel: 22785417</div>
                                        <div className="break-all">santaelena@sannicolas.com.sv</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 sm:space-y-6">
                                    {/* Document Info - Responsive Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="mb-2 text-sm font-semibold sm:text-base">Datos de la factura</h3>
                                            <div className="grid grid-cols-1 rounded-lg bg-[#B5C2B7] p-3 text-xs sm:grid-cols-1 sm:gap-4 sm:p-4 sm:text-sm dark:bg-[#B5C2B7]/50">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">Número de Control:</div>
                                                    <div className="font-mono text-xs leading-tight break-all">
                                                        {invoiceData.identificacion.numeroControl}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">Código de Generación:</div>
                                                    <div className="font-mono text-xs leading-tight break-all">
                                                        {invoiceData.identificacion.codigoGeneracion}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">Fecha:</div>
                                                    <div className="text-xs sm:text-sm">{invoiceData.identificacion.fecEmi}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">Hora:</div>
                                                    <div className="text-xs sm:text-sm">{invoiceData.identificacion.horEmi}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Customer Info */}
                                        <div className="space-y-2">
                                            <h3 className="mb-2 text-sm font-semibold sm:text-base">Datos del Receptor</h3>
                                            <div className="grid grid-cols-1 space-y-4 rounded-lg bg-blue-100 p-3 text-xs sm:grid-cols-2 sm:gap-4 sm:p-4 sm:text-sm dark:bg-blue-400/40">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">
                                                        <strong>Nombre:</strong>
                                                    </div>
                                                    <div className="text-xs sm:text-sm"> {customerData.nombre}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">
                                                        <strong>{customerData.numDocumento ? 'Documento: ' : 'NIT: '}</strong>
                                                    </div>
                                                    <div className="text-xs sm:text-sm"> {customerData.numDocumento || customerData.nit}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">
                                                        <strong>Dirección:</strong>
                                                    </div>
                                                    <div className="text-xs sm:text-sm"> {customerData.direccion.complemento}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold sm:text-sm">
                                                        <strong>Teléfono:</strong>
                                                    </div>
                                                    <div className="text-xs sm:text-sm">{customerData.telefono}</div>
                                                </div>
                                                {customerData.correo && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-semibold sm:text-sm">
                                                            <strong>Email:</strong>
                                                        </div>
                                                        <div className="text-xs sm:text-sm"> {customerData.correo}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items - Mobile Card View / Desktop Table */}
                                    <div>
                                        <h3 className="m-2 text-sm font-semibold sm:text-base">Detalle de Productos</h3>

                                        {/* Desktop Table View */}
                                        <div className="hidden overflow-hidden rounded-lg border lg:block">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-500/50">
                                                    <tr>
                                                        <th className="border-b p-2 text-left">Código</th>
                                                        <th className="border-b p-2 text-left">Descripción</th>
                                                        <th className="border-b p-2 text-right">Cant.</th>
                                                        <th className="border-b p-2 text-right">Precio Unitario</th>
                                                        <th className="border-b p-2 text-right">Desc.</th>
                                                        <th className="border-b p-2 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cartItems.map((item, index) => (
                                                        <tr key={index} className="border-b">
                                                            <td className="p-2 font-mono text-xs">{item.product_code}</td>
                                                            <td className="p-2">{item.description}</td>
                                                            <td className="p-2 text-right">{item.quantity}</td>
                                                            <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                                                            <td className="p-2 text-right">${item.montoDescu?.toFixed(2)}</td>
                                                            <td className="p-2 text-right font-semibold">
                                                                ${(item.quantity * item.price - (item.montoDescu || 0)).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="space-y-2 lg:hidden">
                                            {cartItems.map((item, index) => (
                                                <Card key={index} className="border">
                                                    <CardContent className="p-3">
                                                        <div className="space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div className="min-w-0 flex-1 pr-2">
                                                                    <div className="text-sm leading-tight font-medium break-words">
                                                                        {item.description}
                                                                    </div>
                                                                    <div className="font-mono text-xs break-all text-muted-foreground">
                                                                        {item.product_code}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0 text-sm font-semibold">
                                                                    ${(item.quantity * item.price - (item.montoDescu || 0)).toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                                <div>
                                                                    <span className="text-muted-foreground">Cant:</span> {item.quantity}
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Precio:</span> ${item.price.toFixed(2)}
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Desc:</span> $
                                                                    {item.montoDescu?.toFixed(2) || '0.00'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Totals - Responsive */}
                                    <div className="flex justify-end">
                                        <div className="w-full space-y-2 sm:w-80">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal:</span>
                                                <span>${invoiceData.resumen.subTotalVentas.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Descuentos:</span>
                                                <span>
                                                    $
                                                    {invoiceData.resumen.totalDescu == 0
                                                        ? invoiceData.resumen.totalDescu.toFixed(2)
                                                        : `-${invoiceData.resumen.totalDescu.toFixed(2)}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>IVA (13%):</span>
                                                <span>
                                                    {' '}
                                                    $
                                                    {typeof invoiceData.resumen.totalIva === 'number'
                                                        ? invoiceData.resumen.totalIva.toFixed(2)
                                                        : Array.isArray(invoiceData.resumen.tributos) && invoiceData.resumen.tributos[0]?.valor
                                                          ? Number(invoiceData.resumen.tributos[0].valor).toFixed(2)
                                                          : '0.00'}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-base font-bold sm:text-lg">
                                                <span>Total a Pagar:</span>
                                                <span>${invoiceData.resumen.totalPagar?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="text-xs break-words text-gray-600">{invoiceData.resumen.totalLetras}</div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold sm:text-base">Información de Pago</h3>
                                        <div className="rounded-lg bg-green-50 p-3 sm:p-4 dark:bg-green-500/20">
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1 pr-2">
                                                    <div className="text-sm font-medium break-words sm:text-base">
                                                        {getPaymentLabel(paymentData.pagos[0].codigo)}
                                                    </div>
                                                    {paymentData.pagos[0].referencia && (
                                                        <div className="text-xs break-all text-gray-600 sm:text-sm">
                                                            Ref: {paymentData.pagos[0].referencia}
                                                        </div>
                                                    )}
                                                </div>
                                                <Badge variant="secondary" className="flex-shrink-0 bg-green-100 text-green-800">
                                                    PAGADO
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* JSON Preview - Collapsible on mobile */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Datos JSON</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs break-all whitespace-pre-wrap sm:max-h-60 sm:p-4 dark:bg-accent">
                                        {JSON.stringify(invoiceData, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>

                            {/* Bottom padding for mobile */}
                            <div className="h-4 sm:h-0" />
                        </div>
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
