import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DialogAnularFacturaProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    contraseña: string;
    setContraseña: (value: string) => void;
    onConfirm: () => void;
}

export function DialogAnularFactura({ open, onOpenChange, contraseña, setContraseña, onConfirm }: DialogAnularFacturaProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Anular Factura</DialogTitle>
                    <DialogDescription>Esta acción no se puede deshacer. Ingrese la contraseña de administrador para continuar.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="password">Contraseña de Administrador</Label>
                        <Input
                            id="password"
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            placeholder="Ingrese la contraseña"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Anular Factura
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
