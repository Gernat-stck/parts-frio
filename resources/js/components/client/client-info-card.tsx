import { User } from 'lucide-react';
import { Cliente } from '../../types/clientes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';

export default function ClienteInfoCard({ cliente }: { cliente: Cliente }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium">Nombre Completo</Label>
                        <p className="text-lg">{cliente.name}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Documento de Identidad</Label>
                        <p>{cliente.document}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Teléfono</Label>
                        <p>{cliente.phone}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p>{cliente.email}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Fecha de Registro</Label>
                        <p>{cliente.fechaRegistro}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Total Gastado</Label>
                        <p className="text-lg font-semibold text-green-600">${cliente.montoTotal.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
