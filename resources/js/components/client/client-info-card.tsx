import { Calendar, CreditCard, FileText, Mail, Phone, User } from 'lucide-react';
import type { Cliente } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

export default function ClienteInfoCard({ cliente }: { cliente: Cliente }) {
    return (
        <Card className="border-0 sm:border">
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                {/* Main Info - Always visible */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            <User className="h-3 w-3" />
                            Nombre Completo
                        </Label>
                        <p className="text-sm font-medium break-words sm:text-base lg:text-lg">{cliente.name}</p>
                    </div>

                    <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            <FileText className="h-3 w-3" />
                            Documento
                        </Label>
                        <p className="font-mono text-sm break-all sm:text-base">{cliente.document}</p>
                    </div>

                    <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                        <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            <Calendar className="h-3 w-3" />
                            Fecha de Registro
                        </Label>
                        <p className="text-sm sm:text-base">{cliente.fechaRegistro}</p>
                    </div>
                </div>

                <Separator className="hidden sm:block" />

                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            <Phone className="h-3 w-3" />
                            Teléfono
                        </Label>
                        <p className="text-sm break-all sm:text-base">{cliente.phone}</p>
                    </div>

                    <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            <Mail className="h-3 w-3" />
                            Email
                        </Label>
                        <p className="text-sm break-all sm:text-base">{cliente.email}</p>
                    </div>
                </div>

                <Separator className="hidden sm:block" />

                {/* Stats Section */}
                <div className="space-y-3 sm:space-y-4">
                    <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground sm:text-sm">
                        <CreditCard className="h-3 w-3" />
                        Estadísticas de Compras
                    </Label>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-center sm:p-4 dark:bg-blue-500/20">
                            <div className="text-lg font-bold text-blue-600 sm:text-xl lg:text-2xl">{cliente.totalCompras}</div>
                            <div className="text-xs text-blue-600/80 sm:text-sm">Compra{cliente.totalCompras !== 1 ? 's' : ''} Realizadas</div>
                        </div>

                        <div className="rounded-lg bg-green-50 p-3 text-center sm:p-4 dark:bg-green-500/20">
                            <div className="text-lg font-bold text-green-600 sm:text-xl lg:text-2xl">${cliente.montoTotal.toFixed(2)}</div>
                            <div className="text-xs text-green-600/80 sm:text-sm">Total Gastado</div>
                        </div>
                    </div>

                    {/* Average Purchase - Only on larger screens */}
                    <div className="hidden sm:block">
                        <div className="rounded-lg bg-purple-50 p-3 text-center sm:p-4 dark:bg-purple-500/20">
                            <div className="text-base font-bold text-purple-600 sm:text-lg">
                                ${cliente.totalCompras > 0 ? (cliente.montoTotal / cliente.totalCompras).toFixed(2) : '0.00'}
                            </div>
                            <div className="text-xs text-purple-600/80 sm:text-sm">Promedio por Compra</div>
                        </div>
                    </div>
                </div>

                {/* Customer Status Badge */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                        Cliente {cliente.totalCompras > 5 ? 'Frecuente' : 'Regular'}
                    </Badge>
                    {cliente.montoTotal > 1000 && (
                        <Badge variant="default" className="text-xs sm:text-sm">
                            Cliente Premium
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
