import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { clientesMock } from '@/data/clientes-mock';
import type { Cliente } from '@/types/clientes';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ClienteTable from '../client/client-table';
import ClienteHistorialDialog from './client-record-dialog';

export default function GestionClientes() {
    const [clientes] = useState<Cliente[]>(clientesMock);
    const [busqueda, setBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);

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

    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
                    <p className="text-muted-foreground">Consulta y gestiona la información de tus clientes</p>
                </div>
            </div>

            {/* Búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Buscar Clientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, documento, teléfono o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de clientes con paginación */}
            <Card>
                <CardHeader>
                    <CardTitle>Clientes Registrados ({clientesFiltrados.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <ClienteTable clientes={clientesFiltrados} onVerHistorial={handleVerHistorial} />
                </CardContent>
            </Card>

            {/* Modal de historial de compras */}
            <ClienteHistorialDialog open={mostrarHistorial} onOpenChange={setMostrarHistorial} cliente={clienteSeleccionado} />
        </div>
    );
}
