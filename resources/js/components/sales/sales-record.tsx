import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ClienteRecord } from '@/types/clientes';
import type { PaginationLinks, PaginationMeta } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ClienteTable from '../client/client-table';
import { ServerPagination } from '../ServerPagination';
import ClienteHistorialDialog from './client-record-dialog';

export interface PaginatedClientRecord {
    clientesRecord: {
        data: ClienteRecord[];
        links: PaginationLinks;
        meta: PaginationMeta;
    };
    filters: { busqueda?: string; perPage?: number };
}
export default function GestionClientes() {
    const { clientesRecord, filters } = usePage().props as unknown as PaginatedClientRecord;

    const clientes = clientesRecord.data;
    const pagination = clientesRecord.meta;
    const links = clientesRecord.links;

    const [busqueda, setBusqueda] = useState(filters?.busqueda || '');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteRecord | null>(null);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const isMobile = useIsMobile();

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.sales.record'),
            {
                ...filters,
                page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleVerHistorial = (cliente: ClienteRecord) => {
        setClienteSeleccionado(cliente);
        setMostrarHistorial(true);
    };

    const clearSearch = () => {
        setBusqueda('');
    };
    useEffect(() => {
        // Debounce para evitar múltiples solicitudes mientras se escribe
        const timeout = setTimeout(() => {
            router.get(
                route('admin.sales.record'),
                {
                    busqueda,
                },
                {
                    // Mantener el estado de la página actual, pero actualizar la URL
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Reemplazar la entrada en el historial del navegador
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [busqueda]);
    return (
        <div className="container mx-auto space-y-4 lg:space-y-2">
            <div className="flex max-h-20 flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Gestión de Clientes</h1>
                    <p className="text-sm text-muted-foreground">Consulta y gestiona la información de tus clientes</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{clientes.length} clientes</span>
                </div>
            </div>

            <Card>
                <CardContent className="flex flex-wrap items-center md:justify-between">
                    <div className="flex shrink-0 items-center gap-2 lg:h-6">
                        <Search className="h-4 w-4" />
                        Buscar Clientes
                        {busqueda && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                                {clientes.length} resultado{clientes.length !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    <div className="relative w-full max-w-80 flex-1 sm:max-w-sm sm:min-w-[200px]">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder={isMobile ? 'Buscar clientes...' : 'Buscar por nombre, documento, teléfono o email...'}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pr-5 pl-10"
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

            {clientes.length > 0 ? (
                <div>
                    <Card className="h-full">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:max-h-10 lg:max-h-3">
                            <CardTitle className="text-base">Clientes Registrados</CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {clientes.length} total
                                </Badge>
                                {clientes.length !== clientes.length && (
                                    <Badge variant="secondary" className="text-xs">
                                        Mostrando {clientes.length}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ClienteTable clientes={clientes} onVerHistorial={handleVerHistorial} />
                        </CardContent>
                    </Card>

                    <div className="mt-3 flex justify-center">
                        <ServerPagination
                            meta={pagination}
                            links={links}
                            onPageChange={handlePageChange}
                            pageInfo={{ itemName: 'clientes' }}
                            maxPageButtons={5}
                        />
                    </div>
                </div>
            ) : (
                <Card className="h-full">
                    <CardContent className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">{busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {busqueda ? `No hay clientes que coincidan con "${busqueda}"` : 'Cuando tengas clientes registrados, aparecerán aquí'}
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

            <ClienteHistorialDialog open={mostrarHistorial} onOpenChange={setMostrarHistorial} cliente={clienteSeleccionado} />
        </div>
    );
}
