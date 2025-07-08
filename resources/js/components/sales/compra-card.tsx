import { Calendar } from 'lucide-react';
import { Compra } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

export default function CompraCard({ compra }: { compra: Compra }) {
    return (
        <Card>
            <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{compra.fecha}</span>
                            <Badge variant="outline">{compra.factura}</Badge>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Productos/Servicios:</Label>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {compra.productos.map((producto: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                        {producto}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-semibold">${compra.monto.toFixed(2)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
