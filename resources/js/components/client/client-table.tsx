import { Users } from 'lucide-react';
import { useState } from 'react';
import type { ClienteRecord } from '../../types/clientes';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ClienteRow from './client-row';

export default function ClienteTable({
    clientes,
    onVerHistorial,
}: {
    clientes: ClienteRecord[];
    onVerHistorial: (cliente: ClienteRecord) => void;
    itemsPerPage?: number;
}) {
    const [paginatedClientes] = useState<ClienteRecord[]>(clientes || []);

    return (
        <div className="space-y-2">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40">
                                <TableHead className="text-xs font-semibold">Nombre</TableHead>
                                <TableHead className="text-xs font-semibold">Teléfono</TableHead>
                                <TableHead className="text-xs font-semibold">Identificación</TableHead>
                                <TableHead className="text-xs font-semibold">Email</TableHead>
                                <TableHead className="text-xs font-semibold">Compras</TableHead>
                                <TableHead className="text-right text-xs font-semibold">Monto Total</TableHead>
                                <TableHead className="text-center text-xs font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedClientes.length > 0 ? (
                                paginatedClientes.map((cliente) => (
                                    <ClienteRow key={cliente.id} cliente={cliente} onVerHistorial={onVerHistorial} isMobile={false} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-8 w-8 opacity-50" />
                                            <span>No se encontraron clientes</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
                {paginatedClientes.length > 0 ? (
                    <div className="space-y-3">
                        {paginatedClientes.map((cliente) => (
                            <ClienteRow key={cliente.id} cliente={cliente} onVerHistorial={onVerHistorial} isMobile={true} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <Users className="h-12 w-12 opacity-50" />
                                <p className="text-sm sm:text-base">No se encontraron clientes</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
