import { useState } from 'react';
import type { ClienteRecord } from '../../types/clientes';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ClientRowRes from './cliente-row';

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
        <Card className="border-0 shadow-sm lg:p-0">
                <Table>
                    {/* Desktop Headers - Hidden on mobile */}
                    <TableHeader className="hidden lg:table-header-group">
                        <TableRow className="border-b border-border/50">
                            <TableHead className="font-semibold text-foreground">Nombre</TableHead>
                            <TableHead className="font-semibold text-foreground">Teléfono</TableHead>
                            <TableHead className="font-semibold text-foreground">Identificación</TableHead>
                            <TableHead className="font-semibold text-foreground">Email</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Compras</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Mobile Header - Hidden on desktop */}
                    <TableBody>
                        {paginatedClientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                    No se encontraron clientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedClientes.map((client) => <ClientRowRes key={client.id} cliente={client} onVerHistorial={onVerHistorial} />)
                        )}
                    </TableBody>
                </Table>
        </Card>
    );
}
