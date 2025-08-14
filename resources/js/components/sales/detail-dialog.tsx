import { Factura } from '@/types/invoice';
import logoUrl from '../LOGOPARTSFRIOjpg.jpg';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
interface DialogDetallesFacturaProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    factura: Factura | null;
}

export function DialogDetallesFactura({ open, onOpenChange, factura }: DialogDetallesFacturaProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };
    const tipoDocumento =
        factura?.tipoDTE === '01' ? 'Factura Consumidor Final' : factura?.tipoDTE === '03' ? 'Factura Credito Fiscal' : 'Nota de Credito';
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="mx-auto flex p-2">
                <ScrollArea className="max-h-[90vh] w-[70vh] overflow-auto">
                    {factura && (
                        <Card className="mb-8 border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    {/* Logo Section */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                                            {logoUrl ? (
                                                <img
                                                    src={logoUrl || '/placeholder.svg'}
                                                    alt="Logo"
                                                    className="max-h-full max-w-full rounded object-contain"
                                                />
                                            ) : (
                                                <div className="text-xs font-medium">LOGO</div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold tracking-tight">FACTURA ELECTRÓNICA</h1>
                                            <p className="text-sm">{tipoDocumento}</p>
                                        </div>
                                    </div>

                                    {/* Document Info */}
                                    <div className="space-y-1 text-right">
                                        <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                                            Versión {factura.tipoDTE}
                                        </Badge>
                                        <div className="text-sm">{formatDate(factura.fechaGeneracion)}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Document Details */}
                                <div className="mb-3 gap-4">
                                    <Card className="shadow-md lg:col-span-2">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Información del Documento</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <span className="font-semibold">Código de Generación:</span>
                                                    <p className="mt-1 rounded p-2 font-mono text-xs">{factura.codigoGeneracion}</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-600">Número de Control:</span>
                                                    <p className="mt-1 rounded p-2 font-mono text-xs">{factura.numeroControl}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                {/* Receptor */}
                                <Card className="mb-8 p-4">
                                    <CardHeader>
                                        <CardTitle>RECEPTOR</CardTitle>
                                    </CardHeader>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <strong>Nombre o razón social:</strong> {factura.receptor}
                                        </div>
                                        <div>
                                            <strong>Numero Documento:</strong> {factura.documentoReceptor}
                                        </div>
                                    </div>
                                </Card>
                                <Card className="mb-8 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-gray-800 dark:text-accent-foreground/50">
                                            Detalle de Productos y Servicios
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                                                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-accent-foreground">
                                                            Cant.
                                                        </th>
                                                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-accent-foreground">
                                                            Descripción
                                                        </th>
                                                        <th className="p-3 text-right font-semibold text-gray-700 dark:text-accent-foreground">
                                                            P. Unit.
                                                        </th>
                                                        <th className="p-3 text-right font-semibold text-gray-700 dark:text-accent-foreground">
                                                            V. Gravadas
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {factura.detallesFactura.productos.map((item, index) => (
                                                        <tr key={index} className="border-b border-gray-100 transition-colors hover:bg-accent">
                                                            <td className="p-3 font-medium">{item.cantidad}</td>
                                                            <td className="p-3">
                                                                <div className="font-medium text-gray-900 dark:text-white">{item.nombre}</div>
                                                            </td>
                                                            <td className="p-3 text-right font-mono">{formatCurrency(item.precio)}</td>
                                                            <td className="p-3 text-right font-mono">
                                                                {formatCurrency(item.cantidad * item.precio)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                                {/* Totals */}
                                <div className="mb-8 gap-6">
                                    <Card className="shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-gray-800 dark:text-accent-foreground">Resumen Financiero</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                {/* Agregar este campo TODO:
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">Subtotal Ventas:</span>
                                                <span className="font-mono">{formatCurrency(resumen.subTotalVentas)}</span>
                                            </div>

                                             <div className="flex justify-between py-1">
                                                <span className="text-gray-600">Descuentos:</span>
                                                <span className="font-mono text-red-600">{formatCurrency(resumen.descuGravada)}</span>
                                            </div> */}
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600 dark:text-accent-foreground">IVA (13%):</span>
                                                    <span className="font-mono">{formatCurrency(factura.detallesFactura.iva || 0)}</span>
                                                </div>
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600 dark:text-accent-foreground">Subtotal:</span>
                                                    <span className="font-mono">{formatCurrency(factura.detallesFactura.subtotal)}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between py-2 text-base font-bold">
                                                    <span className="text-gray-800 dark:text-accent-foreground">Total a Pagar:</span>
                                                    <span className="font-mono text-lg text-green-600">
                                                        {formatCurrency(factura.detallesFactura.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
