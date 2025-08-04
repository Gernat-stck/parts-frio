import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importa Select
import { DTE_TYPES, type DteTypeValue } from '@/constants/salesConstants' // Importa las constantes y el tipo
import type { Product } from '@/types/products';
import { Minus, Plus, Receipt, ShoppingCart, Trash2, X } from 'lucide-react';
import { useState } from 'react'; // Importa useState
import NoData from '../187443387_10810386.png'; // Asegúrate de que esta ruta es correcta
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
    // Modificamos handleCheckout para que pueda recibir el tipo de DTE
    handleCheckout: (dteType: DteTypeValue) => void;
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
    // Estado para el tipo de DTE seleccionado en este componente
    const [selectedDteType, setSelectedDteType] = useState<DteTypeValue | ''>('');

    // Función para manejar el checkout con el tipo de DTE seleccionado
    const handleCheckoutWithDte = () => {
        if (cart.length === 0 || !selectedDteType) {
            // Esto ya estará cubierto por el 'disabled' del botón, pero es un buen fallback
            return;
        }
        handleCheckout(selectedDteType);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col">
            <Card className="flex h-full flex-col">
                <CardHeader className="flex-shrink-0 pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                            Carrito de Compras
                        </CardTitle>
                        {cart.length > 0 && (
                            <Button variant="outline" size="sm" onClick={clearCart} className="w-full bg-transparent sm:w-auto">
                                <Trash2 className="h-4 w-4" />
                                <span className="ml-2">Borrar Carrito</span>
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col overflow-hidden p-3 sm:p-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center py-8 opacity-50">
                            <div className="text-center">
                                <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                                <p className="text-sm sm:text-base">El carrito está vacío</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {/* Cart Items with controlled height */}
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="space-y-2 pr-2">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex w-full flex-col gap-2 rounded border p-2 sm:p-3">
                                                {/* Primera fila: Imagen, nombre del producto y botón eliminar */}
                                                <div className="flex items-start gap-2">
                                                    <div className="relative h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                                                        <img
                                                            src={item.img_product ? `/private/${item.img_product}` : NoData}
                                                            alt={item.product_name || 'Producto'}
                                                            className="h-full w-full rounded-lg object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = NoData;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs leading-tight font-medium break-words sm:text-sm">
                                                            {item.product_name || 'Producto sin nombre'}
                                                        </div>
                                                        <div className="mt-1 text-xs text-green-600 sm:text-sm">${(item.price || 0).toFixed(2)}</div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeItem(item.id)}
                                                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        title="Eliminar producto"
                                                    >
                                                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </div>

                                                {/* Segunda fila: Controles de cantidad y subtotal */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="h-6 w-6 p-0 sm:h-7 sm:w-7"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-6 text-center text-xs font-medium sm:w-8 sm:text-sm">
                                                            {item.quantity || 0}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="h-6 w-6 p-0 sm:h-7 sm:w-7"
                                                            disabled={item.quantity >= (availableProducts.find((p) => p.id === item.id)?.stock || 0)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-xs font-bold sm:text-sm">${(item.subtotal || 0).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Totales - Fixed at bottom */}
                            <div className="mt-3 flex-shrink-0 space-y-2 border-t pt-3">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span>Subtotal:</span>
                                    <span>${(cartTotals.subtotal - cartTotals.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span>IVA (12%):</span>
                                    <span>${cartTotals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-base font-bold sm:text-lg">
                                    <span>Total:</span>
                                    <span className="text-green-600">${cartTotals.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Dropdown de DTE y Botón de Checkout */}
                            <div className="mt-4 flex flex-shrink-0 items-center gap-2">
                                {' '}
                                {/* Usar flex y gap para alinear */}
                                <Select onValueChange={(value: DteTypeValue) => setSelectedDteType(value)} value={selectedDteType}>
                                    <SelectTrigger className="flex-1">
                                        {' '}
                                        {/* flex-1 para que ocupe el espacio disponible */}
                                        <SelectValue placeholder="Tipo de DTE" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DTE_TYPES.map((dte) => (
                                            <SelectItem key={dte.value} value={dte.value}>
                                                {dte.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    className="w-auto" // Ajustar el ancho del botón
                                    onClick={handleCheckoutWithDte}
                                    disabled={cart.length === 0 || !selectedDteType} // Deshabilita si el carrito está vacío o no hay DTE seleccionado
                                >
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Procesar Venta
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
