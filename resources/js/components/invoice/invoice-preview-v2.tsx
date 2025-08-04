import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Receiver } from '@/types/clientes';
import type { CartItem, InvoicePayload, Payment } from '@/types/invoice';
import { router } from '@inertiajs/react';
import { Award, Download, Mail, PrinterIcon as Print } from 'lucide-react';
import { toast } from 'sonner';
import { buildResumen } from '../../hooks/use-invoice';

interface InvoiceStepProps {
    cartItems: CartItem[];
    customerData: Receiver;
    paymentData: Payment;
    onPrev: () => void;
}

function convertToFormData<T extends Record<string, unknown>>(obj: T, form: FormData = new FormData(), namespace = ''): FormData {
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

export default function InvoiceStep({ cartItems, customerData, paymentData, onPrev }: InvoiceStepProps) {
    const dteType = localStorage.getItem('typeDte') || '01';

    const generateInvoiceData = () => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.quantity * item.price - (item.montoDescu || 0));
        }, 0);

        const iva = subtotal * 0.13;
        const total = subtotal;

        const now = new Date();
        const generarSegmento = (longitud: number) =>
            [...Array(longitud)]
                .map(() =>
                    Math.floor(Math.random() * 16)
                        .toString(16)
                        .toUpperCase(),
                )
                .join('');

        const codigoGeneracion = `${generarSegmento(8)}-${generarSegmento(4)}-${generarSegmento(4)}-${generarSegmento(4)}-${generarSegmento(12)}`;
        const generarSegmentoAlfanumerico = (longitud: number) =>
            [...Array(longitud)]
                .map(() =>
                    Math.floor(Math.random() * 36)
                        .toString(36)
                        .toUpperCase(),
                )
                .join('');

        const numeroControl = `DTE-${dteType}-${generarSegmentoAlfanumerico(8)}-${now.getFullYear()}${String(Math.floor(Math.random() * 1e11)).padStart(11, '0')}`;
        return {
            identificacion: {
                version: dteType === '01' ? 1 : dteType === '03' ? 3 : 5,
                ambiente: '01',
                tipoDte: dteType,
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
            receptor: { ...customerData },
            cuerpoDocumento: cartItems.map((item, index) => {
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
                        tributos: null
                    };
                }

                return baseItem; // para documentos fiscales: sin ivaItem
            }),

            resumen: buildResumen({
                documentType : dteType as "01" | "03" | "05",
                subtotal,
                total,
                iva,
                cartItems,
                convertirNumeroALetras,
                paymentData,
            }),
            documentoRelacionado: null,
            otrosDocumentos: null,
            ventaTercero: null,
            extension: null,
            apendice: null,
        };
    };

    const convertirNumeroALetras = (numero: number): string => {
        const entero = Math.floor(numero);
        const decimal = Math.round((numero - entero) * 100);
        return `${entero} CON ${decimal}/100 DOLARES`;
    };

    const invoiceData: InvoicePayload = generateInvoiceData();

    const formasPago: { [key: string]: string } = {
        '01': 'EFECTIVO',
        '02': 'TARJETA DE CREDITO',
        '03': 'TARJETA DE DEBITO',
        '04': 'CHEQUE',
        '05': 'TRANSFERENCIA BANCARIA',
        '06': 'DEPOSITO BANCARIO',
        '99': 'OTROS',
    };

    const onCertificate = () => {
        if (!dteType) {
            toast.error('Tipo de DTE no encontrado en localStorage');
            console.error('Tipo de DTE no encontrado en localStorage');
            return;
        }
        const formData = convertToFormData(invoiceData);
        router.post(route('admin.save.invoice', { tipoDte: dteType }), formData);
    };
    return (
        <div className="flex h-full w-full flex-col">
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
                                                            <div className="text-sm leading-tight font-medium break-words">{item.description}</div>
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
                                        <span>${invoiceData.resumen.totalIva?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-base font-bold sm:text-lg">
                                        <span>Total a Pagar:</span>
                                        <span>${invoiceData.resumen.totalPagar.toFixed(2) || '0.00'}</span>
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
                                                {formasPago[paymentData.pagos[0].codigo]}
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
        </div>
    );
}
