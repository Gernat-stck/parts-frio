import { useIsMobile } from '@/hooks/use-mobile';
import { Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Cliente } from '../../types/clientes';
import { Card, CardContent } from '../ui/card';
import { Pagination } from '../ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ClienteRow from './client-row';

export default function ClienteTable({
    clientes,
    onVerHistorial,
    itemsPerPage = 5,
}: {
    clientes: Cliente[];
    onVerHistorial: (cliente: Cliente) => void;
    itemsPerPage?: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedClientes, setPaginatedClientes] = useState<Cliente[]>([]);
    const isMobile = useIsMobile();

    const handlePaginatedData = useCallback((data: Cliente[]) => {
        setPaginatedClientes(data);
    }, []);

    return (
        <div className="space-y-4">
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

            {/* Responsive Pagination */}
            <div className="flex justify-center pt-4">
                <Pagination
                    data={clientes}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPaginatedData={handlePaginatedData}
                    pageInfo={{ itemName: 'clientes' }}
                    maxPageButtons={isMobile ? 3 : 5} // Fewer buttons on mobile
                />
            </div>
        </div>
    );
}
