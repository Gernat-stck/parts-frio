import { CheckCircle } from 'lucide-react';
import { Factura } from '../../data/factura-types';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface DialogCertificarFacturasProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    facturas: Factura[];
    seleccionadas: number[];
    onSeleccionar: (id: number, checked: boolean) => void;
    onConfirm: () => void;
}

export function DialogCertificarFacturas({ open, onOpenChange, facturas, seleccionadas, onSeleccionar, onConfirm }: DialogCertificarFacturasProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Certificar Facturas en Contingencia</DialogTitle>
                    <DialogDescription>Seleccione las facturas que desea certificar</DialogDescription>
                </DialogHeader>
                <div className="max-h-96 space-y-4 overflow-y-auto">
                    {facturas.map((factura) => (
                        <div key={factura.id} className="flex items-center space-x-2 rounded border p-3">
                            <Checkbox
                                id={`factura-${factura.id}`}
                                checked={seleccionadas.includes(factura.id)}
                                onCheckedChange={(checked) => onSeleccionar(factura.id, checked === true)}
                            />
                            <div className="flex-1">
                                <div className="font-medium">{factura.receptor}</div>
                                <div className="text-sm text-muted-foreground">
                                    {factura.fechaGeneracion} - ${factura.monto}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={seleccionadas.length === 0}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Certificar Seleccionadas ({seleccionadas.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
