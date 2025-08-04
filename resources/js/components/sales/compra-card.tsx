import { Calendar } from 'lucide-react';
import type { Compra } from '../../types/clientes';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

export default function CompraCard({ compra }: { compra: Compra }) {
    return (
        <Card className="transition-colors hover:bg-muted/30">
            <CardContent className="p-3 sm:p-4 sm:pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <span className="text-sm font-medium sm:text-base">{compra.fecha}</span>
                            </div>
                            <Badge variant="outline" className="w-fit text-xs">
                                {compra.factura}
                            </Badge>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground sm:text-sm">Productos/Servicios:</Label>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {compra.productos.map((producto: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                        {producto}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-semibold sm:text-xl">${compra.monto.toFixed(2)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
