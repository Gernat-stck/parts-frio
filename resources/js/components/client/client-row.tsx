import { Eye, Phone } from 'lucide-react';
import { Cliente } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TableCell, TableRow } from '../ui/table';

export default function ClienteRow({ cliente, onVerHistorial }: { cliente: Cliente; onVerHistorial: (cliente: Cliente) => void }) {
    return (
        <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.name}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {cliente.phone}
                </div>
            </TableCell>
            <TableCell>{cliente.document}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>
                <Badge variant="secondary">{cliente.totalCompras} compras</Badge>
            </TableCell>
            <TableCell className="font-semibold">${cliente.montoTotal.toFixed(2)}</TableCell>
            <TableCell>
                <Button size="sm" variant="outline" onClick={() => onVerHistorial(cliente)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Historial
                </Button>
            </TableCell>
        </TableRow>
    );
}
