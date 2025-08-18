import { CreditCard, Eye, Mail, MoreHorizontal, Phone, User } from 'lucide-react';
import type { ClienteRecord as Cliente } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { TableCell, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ClienteRowProps {
    cliente: Cliente;
    onVerHistorial: (cliente: Cliente) => void;
    isMobile?: boolean;
    isTablet?: boolean;
}

export default function ClienteRowRes({ cliente, onVerHistorial, isMobile = false, isTablet = false }: ClienteRowProps) {
    // Mobile Card View - Improved mobile layout with better spacing and text handling
    if (isMobile) {
        return (
            <Card className="mb-3 transition-colors hover:bg-muted/30">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {/* Header Row with Name and Action Button */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <h3 className="text-base leading-tight font-medium" title={cliente.name}>
                                        {cliente.name}
                                    </h3>
                                </div>
                                <div className="font-mono text-sm break-all text-muted-foreground" title={cliente.document}>
                                    ID: {cliente.document}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => onVerHistorial(cliente)} className="h-9 flex-shrink-0 px-3">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                            </Button>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Información de Contacto</h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium">Teléfono</div>
                                        <div className="text-sm break-all text-muted-foreground" title={cliente.phone}>
                                            {cliente.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium">Email</div>
                                        <div className="text-sm break-all text-muted-foreground" title={cliente.email}>
                                            {cliente.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Statistics Section */}
                        <div className="space-y-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Estadísticas de Compras</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-muted/30 p-3 text-center">
                                    <div className="mb-1 flex items-center justify-center gap-1">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-bold">{cliente.totalCompras}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Compras Totales</div>
                                </div>
                                <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-950/20">
                                    <div className="mb-1 text-lg font-bold text-green-600">
                                        ${cliente.montoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Monto Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Tablet Compact View - Enhanced tablet layout with better text handling
    if (isTablet) {
        return (
            <TableRow className="transition-colors hover:bg-muted/30">
                <TableCell className="max-w-[200px] min-w-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <span className="truncate font-medium" title={cliente.name}>
                                {cliente.name}
                            </span>
                        </div>
                        <div className="truncate font-mono text-xs text-muted-foreground" title={cliente.document}>
                            {cliente.document}
                        </div>
                    </div>
                </TableCell>
                <TableCell className="max-w-[180px] min-w-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <span className="truncate text-xs" title={cliente.phone}>
                                {cliente.phone}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <span className="truncate text-xs" title={cliente.email}>
                                {cliente.email}
                            </span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="min-w-0">
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        <CreditCard className="mr-1 h-3 w-3" />
                        {cliente.totalCompras}
                    </Badge>
                </TableCell>
                <TableCell className="min-w-0 text-right">
                    <div className="text-sm font-semibold text-green-600">
                        ${cliente.montoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </TableCell>
                <TableCell className="w-12 text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onVerHistorial(cliente)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Historial
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        );
    }

    // Desktop Table Row - Enhanced desktop layout with better overflow handling
    return (
        <TableRow className="transition-colors hover:bg-muted/30">
            <TableCell className="max-w-[200px] min-w-0">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium" title={cliente.name}>
                        {cliente.name}
                    </span>
                </div>
            </TableCell>
            <TableCell className="max-w-[150px] min-w-0">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate" title={cliente.phone}>
                        {cliente.phone}
                    </span>
                </div>
            </TableCell>
            <TableCell className="max-w-[160px] min-w-0">
                <span className="block truncate font-mono text-sm" title={cliente.document}>
                    {cliente.document}
                </span>
            </TableCell>
            <TableCell className="max-w-[220px] min-w-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex min-w-0 cursor-default items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <span className="truncate" title={cliente.email}>
                                    {cliente.email}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-all">
                            {cliente.email}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>
            <TableCell className="min-w-0">
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    <CreditCard className="mr-1 h-3 w-3" />
                    {cliente.totalCompras} compras
                </Badge>
            </TableCell>
            <TableCell className="min-w-0 text-right">
                <div>
                    <div className="font-semibold text-green-600">
                        ${cliente.montoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">Total gastado</div>
                </div>
            </TableCell>
            <TableCell className="w-12 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onVerHistorial(cliente)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Historial
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
