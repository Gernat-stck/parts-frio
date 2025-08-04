import { router } from '@inertiajs/react'; // Import route from @inertiajs/react
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { DteTypeValue } from '@/constants/salesConstants';
import type { ProductData } from '@/types/products';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { Auth } from '../../types';
import type { CartItem } from '../../types/invoice';
import EmptyState from '../empty-state';
import { ProductList } from '../product/product-list';
import { ScrollArea } from '../ui/scroll-area';
import { ShoppingCartPanel } from './shopping-cart-panel';
interface SalesDashboardProps {
    auth: Auth;
    availableProducts: ProductData[];
}
const IVA_RATE = 0.13; // 13%

export default function SalesDashboard({ auth, availableProducts = [] }: SalesDashboardProps) {
    // Estados principales
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Filtrar productos disponibles
    const filteredProducts = useMemo(() => {
        return availableProducts.filter((product) => {
            if (product.stock === 0) return false; // No mostrar productos sin stock

            const matchesSearch =
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, categoryFilter, availableProducts]);

    // Calcular totales del carrito
    const cartTotals = useMemo(() => {
        let totalWithIva = 0;
        let totalIvaAmount = 0;
        let totalWithoutIva = 0;

        cart.forEach((item) => {
            const itemPriceWithIva = item.price; // El precio del ítem ya incluye IVA
            const itemQuantity = item.quantity;

            const pricePerUnitWithoutIva = itemPriceWithIva / (1 + IVA_RATE);
            const ivaPerUnit = itemPriceWithIva - pricePerUnitWithoutIva;

            totalWithoutIva += pricePerUnitWithoutIva * itemQuantity;
            totalIvaAmount += ivaPerUnit * itemQuantity;
            totalWithIva += itemPriceWithIva * itemQuantity; // Esto es simplemente la suma de los subtotales del carrito
        });

        return {
            subtotal: totalWithoutIva, // Subtotal antes de aplicar IVA
            tax: totalIvaAmount, // Monto total de IVA incluido
            total: totalWithIva, // Total final (ya con IVA incluido)
        };
    }, [cart]);

    const categories = [...new Set(availableProducts.map((item) => item.category))];

    // Funciones del carrito
    const addToCart = (product: ProductData) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);

            if (existingItem) {
                if (existingItem.quantity >= product.stock) return prev;

                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } : item,
                );
            } else {
                return [...prev, { ...product, quantity: 1, subtotal: product.price }];
            }
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    const maxQuantity = availableProducts.find((p) => p.id === productId)?.stock || 0;
                    const quantity = Math.min(newQuantity, maxQuantity);
                    return { ...item, quantity, subtotal: quantity * item.price };
                }
                return item;
            }),
        );
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const removeItem = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Procesar venta
    const handleCheckout = (dteType: DteTypeValue) => {
        if (cart.length === 0) return;
        if (!dteType) {
            toast.error('Por favor, selecciona un tipo de DTE.');
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('typeDte', dteType);
        router.get(route('admin.sales.receiver'));
    };

    const handleCreate = () => {
        router.get(route('admin.inventory'));
    };

    return (
        <div className="max-w-6xlxl mx-auto p-2 sm:p-4">
            {/* Mobile Header with Cart Button */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <h1 className="text-xl font-bold sm:text-2xl">Dashboard de Ventas</h1>
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="relative bg-transparent">
                            <ShoppingCart className="h-4 w-4" />
                            {cart.length > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </Badge>
                            )}
                            <span className="ml-2 hidden sm:inline">Carrito</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>Carrito de Compras</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            <ShoppingCartPanel
                                cart={cart}
                                availableProducts={availableProducts}
                                cartTotals={cartTotals}
                                updateQuantity={updateQuantity}
                                clearCart={clearCart}
                                handleCheckout={handleCheckout}
                                removeItem={removeItem}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                {/* Productos Disponibles */}
                <div className="lg:col-span-2">
                    <Card className="border-0 p-0 shadow-none">
                        <CardContent className="p-0 sm:p-6">
                            {/* Filtros - Responsive */}
                            <div className="mb-4 space-y-3 sm:space-y-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform opacity-50" />
                                    <Input
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 text-sm sm:text-base"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Todas las categorías" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las categorías</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Lista de Productos - Responsive Height */}
                            <ScrollArea className="h-[50vh] sm:h-[50vh] lg:h-[58vh]">
                                {filteredProducts.length !== 0 && <ProductList products={filteredProducts} cart={cart} onAddToCart={addToCart} />}
                                {filteredProducts.length === 0 && (
                                    <div className="flex h-full items-center justify-center">
                                        <EmptyState
                                            type="no-products"
                                            actions={[
                                                {
                                                    label: auth.user.role == 'admin' ? 'Administrar inventario' : 'Contacta con el gerente',
                                                    onClick: handleCreate,
                                                    icon: <Plus className="h-4 w-4" />,
                                                },
                                            ]}
                                        />
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Carrito de Compras - Desktop Only */}
                <div className="hidden h-[40vh] lg:block">
                    <ShoppingCartPanel
                        cart={cart}
                        availableProducts={availableProducts}
                        cartTotals={cartTotals}
                        updateQuantity={updateQuantity}
                        clearCart={clearCart}
                        handleCheckout={handleCheckout}
                        removeItem={removeItem}
                    />
                </div>
            </div>

            {/* Mobile Floating Cart Summary */}
            <div className="fixed right-4 bottom-4 left-4 lg:hidden">
                {cart.length > 0 && (
                    <Card className="border-2 border-primary shadow-lg">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <ShoppingCart className="h-4 w-4" />
                                        <Badge variant="secondary" className="text-xs">
                                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-semibold">${cartTotals.total.toFixed(2)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {cart.length} producto{cart.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setIsCartOpen(true)} className="text-xs">
                                        Ver Carrito
                                    </Button>
                                    <Button size="sm" onClick={() => setIsCartOpen(true)} className="text-xs">
                                        Procesar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
