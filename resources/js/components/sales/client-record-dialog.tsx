import { Calendar, IdCard, Mail, MapPin, Phone, ShoppingBag, User } from 'lucide-react';
import { formatUbicacion } from '../../helpers/get-direction';
import type { Cliente } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import CompraCard from './compra-card';

export default function ClienteHistorialDialog({
    open,
    onOpenChange,
    cliente,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cliente: Cliente | null;
}) {
    if (!cliente) return null;
    const address = formatUbicacion(cliente.address);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="mx-2 flex h-[95vh] w-[calc(100vw-1rem)] max-w-5xl flex-col overflow-hidden sm:mx-4 sm:h-[85vh] sm:w-[95vw] lg:w-[90vw] xl:max-w-6xl">
                {/* Header - Fixed */}
                <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg sm:text-xl">Historial de Compras</DialogTitle>
                    </div>
                </DialogHeader>

                {/* Content - Scrollable */}
                <ScrollArea className="flex-1 overflow-hidden">
                    <div className="space-y-4 pr-2 sm:space-y-6 sm:pr-4">
                        {/* Client Info Card - Responsive */}
                        <div className="flex-shrink-0">
                            <Card className="border-0 sm:border">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                        {cliente.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 sm:space-y-4">
                                    {/* Compact Info Grid - Desktop Optimized */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <IdCard className="h-3 w-3" />
                                                Documento
                                            </div>
                                            <p className="font-mono text-sm break-all">{cliente.document}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                Teléfono
                                            </div>
                                            <p className="text-sm break-all">{cliente.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                            </div>
                                            <p className="text-sm">{address}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                Email
                                            </div>
                                            <p className="text-sm break-all">{cliente.email}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                Registro
                                            </div>
                                            <p className="text-sm">{cliente.fechaRegistro}</p>
                                        </div>
                                    </div>

                                    {/* Compact Stats - Desktop Optimized */}
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-center sm:p-3 dark:bg-blue-500/20">
                                            <div className="text-base font-bold text-blue-600 sm:text-lg">{cliente.totalCompras}</div>
                                            <div className="text-xs text-blue-600/80">Compras</div>
                                        </div>

                                        <div className="rounded-lg bg-green-50 p-2 text-center sm:p-3 dark:bg-green-500/20">
                                            <div className="text-base font-bold text-green-600 sm:text-lg">${cliente.montoTotal.toFixed(2)}</div>
                                            <div className="text-xs text-green-600/80">Total</div>
                                        </div>

                                        <div className="col-span-2 rounded-lg bg-purple-50 p-2 text-center sm:col-span-1 sm:p-3 dark:bg-purple-500/20">
                                            <div className="text-base font-bold text-purple-600 sm:text-lg">
                                                ${cliente.totalCompras > 0 ? (cliente.montoTotal / cliente.totalCompras).toFixed(2) : '0.00'}
                                            </div>
                                            <div className="text-xs text-purple-600/80">Promedio</div>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            Cliente {cliente.totalCompras > 5 ? 'Frecuente' : 'Regular'}
                                        </Badge>
                                        {cliente.montoTotal > 1000 && (
                                            <Badge variant="default" className="text-xs">
                                                Cliente Premium
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator className="hidden sm:block" />

                        {/* Purchase History Section */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Historial de Compras
                                </h3>
                                <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                                    {cliente.totalCompras} compra{cliente.totalCompras !== 1 ? 's' : ''}
                                </Badge>
                            </div>

                            {/* Purchase Cards */}
                            <div className="space-y-2 sm:space-y-3">
                                {cliente.historialCompras.length > 0 ? (
                                    cliente.historialCompras.map((compra, idx) => <CompraCard key={idx} compra={compra} />)
                                ) : (
                                    <div className="rounded-lg border border-dashed p-6 text-center sm:p-8">
                                        <ShoppingBag className="mx-auto mb-2 h-8 w-8 opacity-50 sm:h-12 sm:w-12" />
                                        <p className="text-sm text-muted-foreground sm:text-base">Este cliente aún no tiene compras registradas</p>
                                    </div>
                                )}
                            </div>

                            {/* Summary Section - Mobile */}
                            <div className="mt-4 rounded-lg bg-muted/50 p-3 sm:hidden">
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                        <div className="text-lg font-bold">{cliente.totalCompras}</div>
                                        <div className="text-xs text-muted-foreground">Compras</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-green-600">
                                            ${cliente.historialCompras.reduce((total, compra) => total + compra.monto, 0).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Total Gastado</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom padding for mobile */}
                        <div className="h-4 sm:h-0" />
                    </div>
                </ScrollArea>

                {/* Footer - Desktop Summary */}
                <div className="hidden flex-shrink-0 border-t pt-4 sm:block">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Total de {cliente.totalCompras} compra{cliente.totalCompras !== 1 ? 's' : ''}
                        </span>
                        <span className="font-semibold text-green-600">
                            Total gastado: ${cliente.historialCompras.reduce((total, compra) => total + compra.monto, 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
