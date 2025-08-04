import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Cliente } from '@/types/clientes';
import { Search, Users, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import ClienteTable from '../client/client-table';
import ClienteHistorialDialog from './client-record-dialog';

export default function GestionClientes({ clientRecord }: { clientRecord: Cliente[] }) {
    const [clientes] = useState<Cliente[]>(clientRecord || []);
    const [busqueda, setBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedClientes, setPaginatedClientes] = useState<Cliente[]>([]);
    const isMobile = useIsMobile();

    // Filtrar clientes
    const clientesFiltrados = useMemo(
        () =>
            clientes.filter(
                (cliente) =>
                    cliente.name.toLowerCase().includes(busqueda.toLowerCase()) ||
                    cliente.document.includes(busqueda) ||
                    cliente.phone.includes(busqueda) ||
                    cliente.email.toLowerCase().includes(busqueda.toLowerCase()),
            ),
        [clientes, busqueda],
    );

    const handleVerHistorial = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setMostrarHistorial(true);
    };

    const clearSearch = () => {
        setBusqueda('');
        setCurrentPage(1);
    };

    const handlePaginatedData = useCallback((data: Cliente[]) => {
        setPaginatedClientes(data);
    }, []);
    return (
        <div className="flex h-full flex-col space-y-4">
            {/* Header - Compact */}
            <div className="flex-shrink-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Gestión de Clientes</h1>
                        <p className="text-sm text-muted-foreground">Consulta y gestiona la información de tus clientes</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{clientesFiltrados.length} clientes</span>
                    </div>
                </div>
            </div>

            {/* Search Section - Compact */}
            <div className="flex-shrink-0">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Search className="h-4 w-4" />
                            Buscar Clientes
                            {busqueda && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    {clientesFiltrados.length} resultado{clientesFiltrados.length !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder={isMobile ? 'Buscar clientes...' : 'Buscar por nombre, documento, teléfono o email...'}
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pr-10 pl-10"
                            />
                            {busqueda && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform p-0"
                                    onClick={clearSearch}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section - Flexible */}
            <div className="flex-1 overflow-hidden">
                {clientesFiltrados.length > 0 ? (
                    <div className="flex h-full flex-col space-y-4">
                        {/* Table Card */}
                        <div className="flex-1 overflow-hidden">
                            <Card className="h-full border-none">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-base">Clientes Registrados</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {clientesFiltrados.length} total
                                            </Badge>
                                            {paginatedClientes.length !== clientesFiltrados.length && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Mostrando {paginatedClientes.length}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[calc(100%-5rem)] overflow-hidden p-0 sm:p-6">
                                    <ScrollArea className="h-full">
                                        <ClienteTable clientes={paginatedClientes} onVerHistorial={handleVerHistorial} />
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pagination - Fixed at bottom */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-center">
                                <Pagination
                                    data={clientesFiltrados}
                                    itemsPerPage={isMobile ? 3 : 5}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                    onPaginatedData={handlePaginatedData}
                                    pageInfo={{
                                        itemName: 'clientes',
                                    }}
                                    maxPageButtons={isMobile ? 3 : 5}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <Card className="h-full">
                        <CardContent className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    {busqueda
                                        ? `No hay clientes que coincidan con "${busqueda}"`
                                        : 'Cuando tengas clientes registrados, aparecerán aquí'}
                                </p>
                                {busqueda && (
                                    <Button variant="outline" onClick={clearSearch}>
                                        <X className="mr-2 h-4 w-4" />
                                        Limpiar búsqueda
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal */}
            <ClienteHistorialDialog open={mostrarHistorial} onOpenChange={setMostrarHistorial} cliente={clienteSeleccionado} />
        </div>
    );
}
