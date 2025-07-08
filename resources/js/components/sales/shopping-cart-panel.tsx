import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types/products';
import { Minus, Plus, Receipt, ShoppingCart, Trash2, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface CartItem extends Product {
    quantity: number;
    subtotal: number;
}

interface ShoppingCartPanelProps {
    cart: CartItem[];
    availableProducts: Product[];
    cartTotals: { subtotal: number; tax: number; total: number };
    updateQuantity: (productId: number, newQuantity: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    handleCheckout: () => void;
}

export function ShoppingCartPanel({
    cart,
    availableProducts,
    cartTotals,
    updateQuantity,
    removeItem,
    clearCart,
    handleCheckout,
}: ShoppingCartPanelProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingCart className="h-5 w-5" />
                        Carrito de Compras
                    </CardTitle>
                    {cart.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearCart}>
                            <Trash2 className="h-4 w-4" /> Borrar Carrito
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {cart.length === 0 ? (
                        <div className="py-8 text-center opacity-50">
                            <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="max-h-[45vh] overflow-auto">
                                <ScrollArea className="h-[45vh] w-full rounded-md border">
                                    <div className="space-y-2 p-2">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex w-full flex-col gap-2 rounded border p-3">
                                                {/* Primera fila: Imagen, nombre del producto y botón eliminar */}
                                                <div className="flex items-start gap-2">
                                                    <div className="relative h-10 w-10 flex-shrink-0">
                                                        <img
                                                            src={item.image || '/placeholder.svg'}
                                                            alt={item.name}
                                                            className="h-full w-full rounded object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm leading-tight font-medium break-words">{item.name}</div>
                                                        <div className="mt-1 text-sm text-green-600">${item.price.toFixed(2)}</div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeItem(item.id)}
                                                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        title="Eliminar producto"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Segunda fila: Controles de cantidad y subtotal */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="h-7 w-7 p-0"
                                                            disabled={item.quantity >= (availableProducts.find((p) => p.id === item.id)?.stock || 0)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-sm font-bold">${item.subtotal.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Totales */}
                            <div className="space-y-2 border-t pt-3">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>${cartTotals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>IVA (12%):</span>
                                    <span>${cartTotals.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">${cartTotals.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Botón de Checkout */}
                            <Button className="mt-4 w-full" onClick={handleCheckout} disabled={cart.length === 0}>
                                <Receipt className="mr-2 h-4 w-4" />
                                Procesar Venta
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
