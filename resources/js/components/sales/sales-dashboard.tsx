import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialInventoryData } from '@/data/inventory-data';
import { Auth } from '@/types';
import { Product } from '@/types/products';
import { InvoicePreview } from '../invoice/invoice-preview';
import { ProductList } from '../product/product-list';
import { ScrollArea } from '../ui/scroll-area';
import { CustomerForm } from './customer-form';
import { ShoppingCartPanel } from './shopping-cart-panel';
import { CartItem, Sale } from '../../types/invoice';
import { Customer, Seller } from '../../types/invoice-persons';

interface SalesDashboardProps {
    auth: Auth;
}
export default function SalesDashboard({ auth }: SalesDashboardProps) {
    const isAdmin: boolean = auth.user.role === 'admin' || auth.user.role === 'super-admin';
    console.log('isAdmin:', isAdmin);
    // Estados principales
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Estados de modales
    const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
    const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
    const [, setCurrentCustomer] = useState<Customer | null>(null);
    const [currentSale, setCurrentSale] = useState<Sale | null>(null);
    const availableProducts: Product[] = initialInventoryData || [];
    // Filtrar productos disponibles
    const filteredProducts = useMemo(() => {
        return availableProducts.filter((product) => {
            if (product.stock === 0) return false; // No mostrar productos sin stock

            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, categoryFilter]);

    // Calcular totales del carrito
    const cartTotals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.12; // 12% IVA
        const total = subtotal + tax;

        return { subtotal, tax, total };
    }, [cart]);

    const categories = [...new Set(availableProducts.map((item) => item.category))];

    // Funciones del carrito
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);

            if (existingItem) {
                if (existingItem.quantity >= product.stock) return prev; // No exceder stock

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
    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCustomerFormOpen(true);
    };

    const handleCustomerSubmit = (customer: Customer) => {
        if (!selectedSeller) return;

        const sale: Sale = {
            id: `SALE-${Date.now()}`,
            date: new Date().toISOString(),
            seller: selectedSeller,
            customer,
            items: [...cart],
            subtotal: cartTotals.subtotal,
            tax: cartTotals.tax,
            total: cartTotals.total,
            status: 'completed',
        };

        setCurrentSale(sale);
        setCurrentCustomer(customer);
        setIsCustomerFormOpen(false);
        setIsInvoicePreviewOpen(true);
    };

    const completeSale = () => {
        // Aquí actualizarías el stock en la base de datos
        // y guardarías la venta
        clearCart();
        setSelectedSeller(null);
        setCurrentSale(null);
        setCurrentCustomer(null);
        setIsInvoicePreviewOpen(false);
    };

    /**
     if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center p-2 md:p-4 lg:p-6">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <User className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <h2 className="mb-2 text-xl font-semibold">Acceso Restringido</h2>
                        <p className="opacity-70">Solo los administradores pueden acceder al módulo de ventas.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    */
    return (
        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Productos Disponibles */}
                <div className="lg:col-span-2">
                    <Card className="border-0 p-0 shadow-none">
                        <CardContent>
                            {/* Filtros */}
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform opacity-50" />
                                    <Input
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger>
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

                            {/* Lista de Productos */}
                            <ScrollArea className="mt-4 h-[68vh] ">
                                <ProductList products={filteredProducts} cart={cart} onAddToCart={addToCart} />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Carrito de Compras */}
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

            {/* Modales */}
            <CustomerForm isOpen={isCustomerFormOpen} onClose={() => setIsCustomerFormOpen(false)} onSubmit={handleCustomerSubmit} />

            <InvoicePreview
                isOpen={isInvoicePreviewOpen}
                onClose={() => setIsInvoicePreviewOpen(false)}
                sale={currentSale}
                onConfirm={completeSale}
            />
        </div>
    );
}
