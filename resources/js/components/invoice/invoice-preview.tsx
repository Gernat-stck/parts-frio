import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Check, Download } from 'lucide-react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    document: string;
    documentType: 'cedula' | 'ruc' | 'pasaporte';
}

interface Seller {
    id: string;
    name: string;
    email: string;
    commission: number;
}

interface Sale {
    id: string;
    date: string;
    seller: Seller;
    customer: Customer;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'completed' | 'pending';
}

interface InvoicePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    sale: Sale | null;
    onConfirm: () => void;
}

export function InvoicePreview({ isOpen, onClose, sale, onConfirm }: InvoicePreviewProps) {
    if (!sale) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDocumentTypeLabel = (type: string) => {
        switch (type) {
            case 'cedula':
                return 'Cédula';
            case 'ruc':
                return 'RUC';
            case 'pasaporte':
                return 'Pasaporte';
            default:
                return type;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="mx-4 max-h-[95vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Vista Previa de Factura</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header de la Factura */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row">
                                <div>
                                    <h2 className="text-2xl font-bold">FACTURA</h2>
                                    <p className="text-lg font-semibold text-blue-600">{sale.id}</p>
                                    <p className="text-sm opacity-70">{formatDate(sale.date)}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="font-bold">Mi Empresa S.A.</h3>
                                    <p className="text-sm opacity-70">RUC: 1234567890001</p>
                                    <p className="text-sm opacity-70">Dirección: Av. Principal 123</p>
                                    <p className="text-sm opacity-70">Teléfono: (02) 123-4567</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del Cliente y Vendedor */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-3 font-semibold">Datos del Cliente</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <strong>Nombre:</strong> {sale.customer.name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {sale.customer.email}
                                    </div>
                                    <div>
                                        <strong>Teléfono:</strong> {sale.customer.phone}
                                    </div>
                                    <div>
                                        <strong>{getDocumentTypeLabel(sale.customer.documentType)}:</strong> {sale.customer.document}
                                    </div>
                                    <div>
                                        <strong>Dirección:</strong> {sale.customer.address}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-3 font-semibold">Vendedor</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <strong>Nombre:</strong> {sale.seller.name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {sale.seller.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <strong>Comisión:</strong>
                                        <Badge variant="secondary">{sale.seller.commission}%</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detalle de Productos */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="mb-4 font-semibold">Detalle de Productos</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left">Producto</th>
                                            <th className="py-2 text-right">Precio Unit.</th>
                                            <th className="py-2 text-center">Cantidad</th>
                                            <th className="py-2 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sale.items.map((item) => (
                                            <tr key={item.id} className="border-b">
                                                <td className="py-2">{item.name}</td>
                                                <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                                                <td className="py-2 text-center">{item.quantity}</td>
                                                <td className="py-2 text-right">${item.subtotal.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Totales */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${sale.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>IVA (12%):</span>
                                    <span>${sale.tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">${sale.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex flex-col justify-end gap-3 sm:flex-row">
                        <Button variant="outline" onClick={onClose} className="order-3 bg-transparent sm:order-1">
                            Cancelar
                        </Button>
                        <Button variant="outline" className="order-2 bg-transparent">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Button>
                        <Button onClick={onConfirm} className="order-1 sm:order-3">
                            <Check className="mr-2 h-4 w-4" />
                            Confirmar Venta
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
