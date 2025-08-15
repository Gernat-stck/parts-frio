import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ContingenciaPayload, Factura } from '@/types/invoice';
import { PaginationLinks, PaginationMeta } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { AlertTriangle, Eye, FilePenLineIcon, MoreVertical, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { buildContingencyPayload, convertToFormData } from '../../helpers/generadores';
import { ServerPagination } from '../ServerPagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AnulacionDialog } from './anulation-dialog';
import { DialogCertificarFacturas } from './certificate-dialog';
import FilterAndSearch from './filter-search-component';

interface HistorialPageProps {
    salesHistory: {
        data: Factura[];
        meta: PaginationMeta;
        links: PaginationLinks;
    };
    filters: { busqueda?: string; estado?: string; month?: string; year?: string };
}

export default function HistorialFacturas() {
    const { salesHistory, filters } = usePage().props as unknown as HistorialPageProps;
    // Usar los datos del `salesHistory` del backend directamente
    const facturas = salesHistory.data;
    const pagination = salesHistory.meta;
    const links = salesHistory.links;
    // Inicializar los estados con los filtros recibidos del backend
    const [busqueda, setBusqueda] = useState(filters?.busqueda || '');
    const [filtroEstado, setFiltroEstado] = useState(filters?.estado || 'todos');
    const [mes, setMes] = useState(String(filters?.month) || String(new Date().getMonth() + 1));
    const [anio, setAnio] = useState(String(filters?.year) || String(new Date().getFullYear()));

    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
    const [mostrarAnular, setMostrarAnular] = useState(false);
    const [mostrarCertificar, setMostrarCertificar] = useState(false);
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<string[]>([]);

    const facturasContingencia = facturas?.filter((f) => f.estado === 'CONTINGENCIA');

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.sales.history'),
            {
                ...filters,
                page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleClearFilters = () => {
        setBusqueda('');
        setFiltroEstado('todos');
        setMes(String(new Date().getMonth() + 1));
        setAnio(String(new Date().getFullYear()));
    };

    const handleVerDetalles = (factura: Factura) => {
        router.get(route('admin.sales.history.dte.detail', { numeroGeneracion: factura.codigoGeneracion }));
    };

    const handleAnularFactura = (factura: Factura) => {
        setFacturaSeleccionada(factura);
        setMostrarAnular(true);
    };
    const handleSeleccionarFactura = (facturaNc: string, seleccionada: boolean) => {
        if (seleccionada) {
            setFacturasSeleccionadas((prev) => [...prev, facturaNc]);
        } else {
            setFacturasSeleccionadas((prev) => prev.filter((id) => id !== facturaNc));
        }
    };

    const certificarFacturasSeleccionadas = (data: ContingenciaPayload) => {
        // En un escenario real, aquí se haría una solicitud al backend
        // para certificar las facturas.
        if (data.selectedFacturas.length === 0) {
            toast.error('Debe seleccionar al menos una factura para certificar');
            return;
        }
        const dataPayload = buildContingencyPayload(data);
        const formData = convertToFormData(dataPayload);

        router.post(route('admin.sales.certify'), formData, {
            onSuccess: () => {
                setFacturasSeleccionadas([]);
                setMostrarCertificar(false);
            },
        });
    };
    const createNotaCredito = (CodigoGeneracion: string | null, tipoDocumento: string) => {
        if (!CodigoGeneracion) {
            toast.error('La factura no tiene un código de generación válido para crear una nota de crédito.');
            return;
        }
        if (tipoDocumento !== '03') {
            toast.error('Nota de credito solo valido para documentos Credito Fiscal (03) y Comprobante de retencion (07)');
            return;
        }
        router.get(route('admin.sales.show.credit.note', { codigoGeneracion: CodigoGeneracion }));
    };

    useEffect(() => {
        // Debounce para evitar múltiples solicitudes mientras se escribe
        const timeout = setTimeout(() => {
            router.get(
                route('admin.sales.history'),
                {
                    busqueda,
                    estado: filtroEstado,
                    month: mes,
                    year: anio,
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
    }, [busqueda, filtroEstado, mes, anio]);
    return (
        <div className="container mx-auto space-y-4 p-2 sm:p-4 lg:p-6">
            {/* Header Section - Responsive */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold sm:text-3xl">Historial de Facturas</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Gestiona y consulta todas las facturas emitidas</p>
                </div>
                {facturasContingencia.length > 0 && (
                    <Button onClick={() => setMostrarCertificar(true)} className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto" size="sm">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Certificar Contingencias</span>
                        <span className="sm:hidden">Certificar</span>
                        <span className="ml-1">({facturasContingencia.length})</span>
                    </Button>
                )}
            </div>

            {/* Filtros y búsqueda */}
            <FilterAndSearch
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                mes={mes}
                setMes={setMes}
                anio={anio}
                setAnio={setAnio}
                onClearFilters={handleClearFilters}
            />
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Facturas ({facturas.length})</span>
                            <Badge variant="secondary" className="text-xs">
                                Actualizado
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="text-xs font-semibold whitespace-nowrap text-muted-foreground">Tipo DTE</TableHead>
                                    <TableHead className="text-xs font-semibold">Fecha</TableHead>
                                    <TableHead className="text-xs font-semibold">Código</TableHead>
                                    <TableHead className="text-xs font-semibold">Receptor</TableHead>
                                    <TableHead className="text-xs font-semibold">Documento</TableHead>
                                    <TableHead className="text-right text-xs font-semibold">Monto</TableHead>
                                    <TableHead className="text-xs font-semibold">Estado</TableHead>
                                    <TableHead className="text-center text-xs font-semibold">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facturas.length > 0 ? (
                                    facturas.map((factura) => (
                                        <TableRow key={factura.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="text-center text-sm">{factura.tipoDTE}</TableCell>
                                            <TableCell className="text-sm">{factura.fechaGeneracion}</TableCell>
                                            <TableCell>
                                                {factura.codigoGeneracion ? (
                                                    <code className="text-sm text-blue-600">{factura.numeroControl}</code>
                                                ) : (
                                                    <Badge variant="outline" className="text-orange-600">
                                                        Sin código
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="max-w-60 truncate overflow-hidden text-sm font-medium whitespace-nowrap">
                                                        {factura.receptor}
                                                    </TableCell>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span>{factura.receptor}</span>
                                                </TooltipContent>
                                            </Tooltip>
                                            <TableCell className="text-sm">{factura.documentoReceptor}</TableCell>
                                            <TableCell className="text-right text-sm">${factura.monto.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        factura.estado === 'PROCESADO'
                                                            ? 'default'
                                                            : factura.estado === 'ANULADO'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {factura.estado === 'PROCESADO'
                                                        ? 'Certificada'
                                                        : factura.estado === 'ANULADO'
                                                          ? 'Anulado'
                                                          : 'Contingencia'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleVerDetalles(factura)}>
                                                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Ver detalles
                                                        </DropdownMenuItem>
                                                        {factura.tipoDTE === '03' && (
                                                            <DropdownMenuItem
                                                                onClick={() => createNotaCredito(factura.codigoGeneracion, factura.tipoDTE)}
                                                            >
                                                                <FilePenLineIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                Nota de crédito
                                                            </DropdownMenuItem>
                                                        )}
                                                        {factura.estado !== 'ANULADO' && (
                                                            <DropdownMenuItem onClick={() => handleAnularFactura(factura)}>
                                                                <X className="mr-2 h-4 w-4 text-destructive" />
                                                                Anular
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                            No se encontraron facturas
                                        </td>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Facturas ({facturas.length})</h2>
                    <Badge variant="secondary" className="text-xs">
                        Actualizado
                    </Badge>
                </div>

                {facturas.length > 0 ? (
                    <div className="space-y-3">
                        {facturas.map((factura) => (
                            <Card key={factura.id} className="transition-colors hover:bg-muted/30">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">{factura.receptor}</div>
                                                <div className="text-xs text-muted-foreground">{factura.fechaGeneracion}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        factura.estado === 'PROCESADO'
                                                            ? 'default'
                                                            : factura.estado === 'ANULADO'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {factura.estado === 'PROCESADO'
                                                        ? 'Certificada'
                                                        : factura.estado === 'ANULADO'
                                                          ? 'Anulado'
                                                          : 'Contingencia'}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleVerDetalles(factura)}>
                                                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Ver detalles
                                                        </DropdownMenuItem>
                                                        {factura.estado !== 'ANULADO' && (
                                                            <DropdownMenuItem onClick={() => handleAnularFactura(factura)}>
                                                                <X className="mr-2 h-4 w-4 text-destructive" />
                                                                Anular
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <div className="text-xs text-muted-foreground">Código</div>
                                                <div className="mt-1">
                                                    {factura.codigoGeneracion ? (
                                                        <code className="text-xs break-all text-blue-600">{factura.numeroControl}</code>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-orange-600">
                                                            Sin código
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Monto</div>
                                                <div className="mt-1 font-medium">${factura.monto}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs text-muted-foreground">Documento</div>
                                                <div className="mt-1 break-all">{factura.documentoReceptor}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">No se encontraron facturas</CardContent>
                    </Card>
                )}
            </div>

            {/* Responsive Pagination */}
            <div className="flex justify-center">
                <ServerPagination
                    meta={pagination}
                    links={links}
                    onPageChange={handlePageChange}
                    pageInfo={{ itemName: 'facturas' }}
                    maxPageButtons={5}
                />
            </div>

            {/* Modal de anulación */}
            <AnulacionDialog open={mostrarAnular} onOpenChange={setMostrarAnular} venta={facturaSeleccionada} clearFilter={handleClearFilters}/>

            {/* Modal de certificación */}
            <DialogCertificarFacturas
                open={mostrarCertificar}
                onOpenChange={setMostrarCertificar}
                facturas={facturasContingencia}
                seleccionadas={facturasSeleccionadas}
                onSeleccionar={handleSeleccionarFactura}
                onConfirm={certificarFacturasSeleccionadas}
            />
        </div>
    );
}
