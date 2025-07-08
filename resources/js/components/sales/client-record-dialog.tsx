import { ShoppingBag } from "lucide-react";
import { Cliente } from "../../types/clientes";
import ClienteInfoCard from "../client/client-info-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CompraCard from "./compra-card";

export default function ClienteHistorialDialog({ open, onOpenChange, cliente }: { open: boolean; onOpenChange: (open: boolean) => void; cliente: Cliente | null }) {
    if (!cliente) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Historial de Compras</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <ClienteInfoCard cliente={cliente} />
                    <Separator />
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <ShoppingBag className="h-5 w-5" />
                            Historial de Compras ({cliente.totalCompras})
                        </h3>
                        <div className="space-y-3">
                            {cliente.historialCompras.map((compra, idx) => (
                                <CompraCard key={idx} compra={compra} />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}