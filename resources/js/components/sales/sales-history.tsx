import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Factura } from '@/data/factura-types';
import { AlertTriangle, Eye, MoreVertical, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { filtrarFacturas } from '../../hooks/use-invoice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Pagination } from '../ui/pagination';
import { DialogAnularFactura } from './anulation-dialog';
import { DialogCertificarFacturas } from './certificate-dialog';
import { DialogDetallesFactura } from './detail-dialog';
import FilterAndSearch from './filter-search-component';

export default function HistorialFacturas({ facturasRec }: { facturasRec: Factura[] }) {
    const [facturas, setFacturas] = useState<Factura[]>(facturasRec || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [mostrarAnular, setMostrarAnular] = useState(false);
    const [mostrarCertificar, setMostrarCertificar] = useState(false);
    const [contraseñaAdmin, setContraseñaAdmin] = useState('');
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [facturasPaginadas, setFacturasPaginadas] = useState<Factura[]>([]);

    const handlePaginatedData = useCallback((data: Factura[]) => {
        setFacturasPaginadas(data);
    }, []);

    // Filtrar facturas
    const facturasFiltradas = useMemo(() => filtrarFacturas(facturas, busqueda, filtroEstado), [facturas, busqueda, filtroEstado]);

    const facturasContingencia = facturas.filter((f) => f.estado === 'rechazada');

    const handleVerDetalles = (factura: Factura) => {
        setFacturaSeleccionada(factura);
        setMostrarDetalles(true);
    };

    const handleAnularFactura = (factura: Factura) => {
        setFacturaSeleccionada(factura);
        setMostrarAnular(true);
    };

    const confirmarAnulacion = () => {
        if (contraseñaAdmin === 'admin123' && facturaSeleccionada) {
            setFacturas((prev) => prev.map((f) => (f.id === facturaSeleccionada.id ? { ...f, estado: 'anulada' } : f)));
            setMostrarAnular(false);
            setContraseñaAdmin('');
            setFacturaSeleccionada(null);
        } else {
            toast.error('Contraseña incorrecta', {
                duration: 3000,
                position: 'top-right',
            });
        }
    };

    const handleSeleccionarFactura = (facturaId: number, seleccionada: boolean) => {
        if (seleccionada) {
            setFacturasSeleccionadas((prev) => [...prev, facturaId]);
        } else {
            setFacturasSeleccionadas((prev) => prev.filter((id) => id !== facturaId));
        }
    };

    const certificarFacturasSeleccionadas = () => {
        setFacturas((prev) =>
            prev.map((f) =>
                facturasSeleccionadas.includes(f.id)
                    ? { ...f, estado: 'aceptado', codigoGeneracion: `DTE-001-2024-${String(f.id).padStart(6, '0')}` }
                    : f,
            ),
        );
        setFacturasSeleccionadas([]);
        setMostrarCertificar(false);
    };

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
            <FilterAndSearch busqueda={busqueda} setBusqueda={setBusqueda} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} />

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Facturas ({facturasFiltradas.length})</span>
                            <Badge variant="secondary" className="text-xs">
                                Actualizado
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="text-xs font-semibold whitespace-nowrap text-muted-foreground">Fecha</TableHead>
                                    <TableHead className="text-xs font-semibold">Código</TableHead>
                                    <TableHead className="text-xs font-semibold">Receptor</TableHead>
                                    <TableHead className="text-xs font-semibold">Documento</TableHead>
                                    <TableHead className="text-right text-xs font-semibold">Monto</TableHead>
                                    <TableHead className="text-xs font-semibold">Estado</TableHead>
                                    <TableHead className="text-center text-xs font-semibold">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facturasPaginadas.length > 0 ? (
                                    facturasPaginadas.map((factura) => (
                                        <TableRow key={factura.id} className="transition-colors hover:bg-muted/30">
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
                                            <TableCell className="text-sm font-medium">{factura.receptor}</TableCell>
                                            <TableCell className="text-sm">{factura.documentoReceptor}</TableCell>
                                            <TableCell className="text-right text-sm">${factura.monto}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        factura.selloRecibido
                                                            ? 'default'
                                                            : factura.estado === 'rechazada'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {factura.selloRecibido
                                                        ? 'Certificada'
                                                        : factura.estado === 'rechazada'
                                                          ? 'Rechazada'
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
                                                        {factura.estado !== 'anulada' && (
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
                    <h2 className="text-lg font-semibold">Facturas ({facturasFiltradas.length})</h2>
                    <Badge variant="secondary" className="text-xs">
                        Actualizado
                    </Badge>
                </div>

                {facturasPaginadas.length > 0 ? (
                    <div className="space-y-3">
                        {facturasPaginadas.map((factura) => (
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
                                                        factura.selloRecibido
                                                            ? 'default'
                                                            : factura.estado === 'rechazada'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {factura.selloRecibido
                                                        ? 'Certificada'
                                                        : factura.estado === 'rechazada'
                                                          ? 'Rechazada'
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
                                                        {factura.estado !== 'anulada' && (
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
                <Pagination
                    data={facturasFiltradas}
                    itemsPerPage={5}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPaginatedData={handlePaginatedData}
                    pageInfo={{
                        itemName: 'facturas',
                    }}
                    maxPageButtons={3} // Reduced for mobile
                />
            </div>

            {/* Modal de detalles */}
            <DialogDetallesFactura open={mostrarDetalles} onOpenChange={setMostrarDetalles} factura={facturaSeleccionada} />

            {/* Modal de anulación */}
            <DialogAnularFactura
                open={mostrarAnular}
                onOpenChange={setMostrarAnular}
                contraseña={contraseñaAdmin}
                setContraseña={setContraseñaAdmin}
                onConfirm={confirmarAnulacion}
            />

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
