import { CreditCard, Eye, Mail, Phone, User } from 'lucide-react';
import type { Cliente } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { TableCell, TableRow } from '../ui/table';

interface ClienteRowProps {
    cliente: Cliente;
    onVerHistorial: (cliente: Cliente) => void;
    isMobile?: boolean;
}

export default function ClienteRow({ cliente, onVerHistorial, isMobile = false }: ClienteRowProps) {
    // Mobile Card View
    if (isMobile) {
        return (
            <Card className="transition-colors hover:bg-muted/30">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div className="text-sm font-medium break-words">{cliente.name}</div>
                                </div>
                                <div className="mt-1 text-xs break-all text-muted-foreground">{cliente.document}</div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => onVerHistorial(cliente)} className="flex-shrink-0 bg-transparent">
                                <Eye className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Ver Historial</span>
                            </Button>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                <span className="text-xs break-all">{cliente.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                <span className="text-xs break-all">{cliente.email}</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between border-t pt-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-xs">
                                    <CreditCard className="mr-1 h-3 w-3" />
                                    {cliente.totalCompras} compras
                                </Badge>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-green-600">${cliente.montoTotal.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Total gastado</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Desktop Table Row
    return (
        <TableRow className="transition-colors hover:bg-muted/30">
            <TableCell>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium break-words">{cliente.name}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{cliente.phone}</span>
                </div>
            </TableCell>
            <TableCell>
                <span className="font-mono text-sm break-all">{cliente.document}</span>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{cliente.email}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="secondary" className="text-xs">
                    <CreditCard className="mr-1 h-3 w-3" />
                    {cliente.totalCompras} compras
                </Badge>
            </TableCell>
            <TableCell>
                <div className="text-right">
                    <div className="font-semibold text-green-600">${cliente.montoTotal.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Total gastado</div>
                </div>
            </TableCell>
            <TableCell>
                <Button size="sm" variant="outline" onClick={() => onVerHistorial(cliente)} className="bg-transparent">
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">Ver Historial</span>
                    <span className="lg:hidden">Ver</span>
                </Button>
            </TableCell>
        </TableRow>
    );
}
