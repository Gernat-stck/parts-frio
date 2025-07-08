import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Factura } from '@/data/factura-types';
import { facturasMock } from '@/data/facturas-mock';
import { AlertTriangle, Calendar, CheckCircle, Eye, FileText, Filter, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function HistorialFacturas() {
    const [facturas, setFacturas] = useState<Factura[]>(facturasMock);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroPuntoVenta, setFiltroPuntoVenta] = useState('todos');
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [mostrarAnular, setMostrarAnular] = useState(false);
    const [mostrarCertificar, setMostrarCertificar] = useState(false);
    const [contraseñaAdmin, setContraseñaAdmin] = useState('');
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<number[]>([]);

    // Filtrar facturas
    const facturasFiltradas = facturas.filter((factura) => {
        const busquedaLimpia = busqueda.trim().toLowerCase();
        const coincideBusqueda =
            factura.receptor.toLowerCase().includes(busquedaLimpia) ||
            factura.documentoReceptor.includes(busquedaLimpia) ||
            (factura.codigoGeneracion && factura.codigoGeneracion.trim().toLowerCase().includes(busquedaLimpia));

        const coincideEstado = filtroEstado === 'todos' || factura.estado.toLowerCase() === filtroEstado;
        const coincidePuntoVenta = filtroPuntoVenta === 'todos' || factura.puntoVenta === filtroPuntoVenta;

        return coincideBusqueda && coincideEstado && coincidePuntoVenta;
    });

    const facturasContingencia = facturas.filter((f) => f.estado === 'Contingencia');

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
            setFacturas((prev) => prev.map((f) => (f.id === facturaSeleccionada.id ? { ...f, estado: 'Anulada' } : f)));
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
                    ? { ...f, estado: 'Certificada', codigoGeneracion: `DTE-001-2024-${String(f.id).padStart(6, '0')}` }
                    : f,
            ),
        );
        setFacturasSeleccionadas([]);
        setMostrarCertificar(false);
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Historial de Facturas</h1>
                    <p className="text-muted-foreground">Gestiona y consulta todas las facturas emitidas</p>
                </div>
                {facturasContingencia.length > 0 && (
                    <Button onClick={() => setMostrarCertificar(true)} className="bg-orange-600 hover:bg-orange-700">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Certificar Contingencias ({facturasContingencia.length})
                    </Button>
                )}
            </div>

            {/* Filtros y búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros y Búsqueda
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por receptor, documento o código..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                <SelectItem value="certificada">Certificada</SelectItem>
                                <SelectItem value="contingencia">Contingencia</SelectItem>
                                <SelectItem value="anulada">Anulada</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filtroPuntoVenta} onValueChange={setFiltroPuntoVenta}>
                            <SelectTrigger>
                                <SelectValue placeholder="Punto de Venta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los puntos</SelectItem>
                                <SelectItem value="001">Punto 001</SelectItem>
                                <SelectItem value="002">Punto 002</SelectItem>
                                <SelectItem value="003">Punto 003</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setBusqueda('');
                                setFiltroEstado('todos');
                                setFiltroPuntoVenta('todos');
                            }}
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de facturas */}
            <Card>
                <CardHeader>
                    <CardTitle>Facturas ({facturasFiltradas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Receptor</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Punto Venta</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facturasFiltradas.map((factura) => (
                                <TableRow key={factura.id}>
                                    <TableCell>{factura.fechaGeneracion}</TableCell>
                                    <TableCell>
                                        {factura.codigoGeneracion || (
                                            <Badge variant="outline" className="text-orange-600">
                                                Sin código
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{factura.receptor}</TableCell>
                                    <TableCell>{factura.documentoReceptor}</TableCell>
                                    <TableCell>{factura.puntoVenta}</TableCell>
                                    <TableCell>${factura.monto.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                factura.estado === 'Certificada'
                                                    ? 'default'
                                                    : factura.estado === 'Contingencia'
                                                      ? 'secondary'
                                                      : 'destructive'
                                            }
                                        >
                                            {factura.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleVerDetalles(factura)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {factura.estado !== 'Anulada' && (
                                                <Button size="sm" variant="destructive" onClick={() => handleAnularFactura(factura)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal de detalles */}
            <Dialog open={mostrarDetalles} onOpenChange={setMostrarDetalles}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalles de Factura</DialogTitle>
                    </DialogHeader>
                    {facturaSeleccionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fecha de Generación</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{facturaSeleccionada.fechaGeneracion}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Código de Generación</Label>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{facturaSeleccionada.codigoGeneracion || 'Sin código'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Receptor</Label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{facturaSeleccionada.receptor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Documento</Label>
                                    <span>{facturaSeleccionada.documentoReceptor}</span>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label className="text-sm font-medium">Productos/Servicios</Label>
                                <div className="mt-2 space-y-2">
                                    {facturaSeleccionada.detalles.productos.map((producto, index) => (
                                        <div key={index} className="flex items-center justify-between rounded bg-muted p-2">
                                            <span>{producto.nombre}</span>
                                            <span>
                                                {producto.cantidad} x ${producto.precio.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="font-semibold">Total:</span>
                                <span className="text-xl font-bold">${facturaSeleccionada.monto.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal de anulación */}
            <Dialog open={mostrarAnular} onOpenChange={setMostrarAnular}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Anular Factura</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Ingrese la contraseña de administrador para continuar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="password">Contraseña de Administrador</Label>
                            <Input
                                id="password"
                                type="password"
                                value={contraseñaAdmin}
                                onChange={(e) => setContraseñaAdmin(e.target.value)}
                                placeholder="Ingrese la contraseña"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMostrarAnular(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmarAnulacion}>
                            Anular Factura
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de certificación */}
            <Dialog open={mostrarCertificar} onOpenChange={setMostrarCertificar}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Certificar Facturas en Contingencia</DialogTitle>
                        <DialogDescription>Seleccione las facturas que desea certificar</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 space-y-4 overflow-y-auto">
                        {facturasContingencia.map((factura) => (
                            <div key={factura.id} className="flex items-center space-x-2 rounded border p-3">
                                <Checkbox
                                    id={`factura-${factura.id}`}
                                    checked={facturasSeleccionadas.includes(factura.id)}
                                    onCheckedChange={(checked) => handleSeleccionarFactura(factura.id, checked === true)}
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{factura.receptor}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {factura.fechaGeneracion} - ${factura.monto.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMostrarCertificar(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={certificarFacturasSeleccionadas} disabled={facturasSeleccionadas.length === 0}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Certificar Seleccionadas ({facturasSeleccionadas.length})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
