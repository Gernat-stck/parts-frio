import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/types/products';
import { Plus } from 'lucide-react';
import NoData from '../187443387_10810386.png';

interface ProductListProps {
    products: ProductData[];
    cart?: { id: number; quantity: number }[];
    onAddToCart?: (product: ProductData) => void;
}

export function ProductList({ products, cart = [], onAddToCart }: ProductListProps) {
    return (
        <div>
            {products.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                const availableStock = product.stock - (cartItem?.quantity || 0);

                return (
                    <div key={product.id} className="flex items-center gap-3 border p-3 transition-transform hover:scale-97 hover:transform">
                        <div className="relative h-12 w-12 flex-shrink-0">
                            <img
                                src={`/private/${product.img_product}`}
                                alt={product.product_name}
                                className="h-full w-full rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = NoData;
                                }}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{product.product_name}</div>
                            <div className="truncate text-xs opacity-70">{product.description}</div>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                                <Badge variant="outline" className="text-xs">
                                    Stock: {product.stock}
                                </Badge>
                            </div>
                        </div>
                        {onAddToCart && (
                            <Button
                                size="sm"
                                onClick={() => onAddToCart(product)}
                                disabled={availableStock <= 0}
                                className="flex-shrink-0 bg-green-500 disabled:bg-gray-500"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
