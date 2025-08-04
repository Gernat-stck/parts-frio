import { Factura } from '@/data/factura-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface DialogDetallesFacturaProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    factura: Factura | null;
}

export function DialogDetallesFactura({ open, onOpenChange, factura }: DialogDetallesFacturaProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalles de Factura</DialogTitle>
                </DialogHeader>
                {factura && <div className="space-y-4">{/* ...estructura interna como la que ya tienes... */}</div>}
            </DialogContent>
        </Dialog>
    );
}
