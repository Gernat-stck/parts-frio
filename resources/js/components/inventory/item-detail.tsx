import { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';
import { AlertCircle, Barcode, Package } from 'lucide-react';
import NoData from '../187443387_10810386.png';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export default function ItemDetails({ selectedProduct }: { selectedProduct: Product }) {
    return (
        <div className="space-y-8 p-6">
            {/* Sección principal con imagen y detalles básicos */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Imagen del producto */}
                <div className="lg:col-span-1">
                    <div className="relative mx-auto aspect-square w-full max-w-sm">
                        <img
                            src={selectedProduct.img_product}
                            alt={selectedProduct.product_name}
                            className="h-full w-full rounded-xl border object-cover shadow-lg"
                            onError={(e) => {
                                e.currentTarget.src = NoData;
                            }}
                        />
                    </div>
                </div>

                {/* Información principal */}
                <div className="space-y-6 lg:col-span-2">
                    <div>
                        <h2 className="mb-2 text-3xl font-bold text-foreground">{selectedProduct.product_name}</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">{selectedProduct.description}</p>
                    </div>

                    {/* Badges y estado */}
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="secondary" className="px-3 py-1 text-base">
                            {selectedProduct.category}
                        </Badge>
                        {(() => {
                            const stockStatus = getStockStatus(selectedProduct.stock, selectedProduct.min_stock);
                            const StatusIcon = stockStatus.icon;
                            return (
                                <Badge
                                    variant={
                                        stockStatus.status === 'critico' ? 'destructive' : stockStatus.status === 'bajo' ? 'default' : 'secondary'
                                    }
                                    className="px-3 py-1 text-base"
                                >
                                    <StatusIcon className="mr-2 h-4 w-4" />
                                    {stockStatus.label}
                                </Badge>
                            );
                        })()}
                    </div>

                    {/* Precio destacado */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-green-700">Precio Unitario</span>
                            <span className="text-3xl font-bold text-green-600">${selectedProduct.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información detallada en cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Información del producto */}
                <Card className="h-70">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Barcode className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Información del Producto</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="font-semibold">#{selectedProduct.id}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                <span className="text-muted-foreground">Código:</span>
                                <span className="font-semibold">{selectedProduct.product_code}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Categoría:</span>
                                <span className="font-semibold">{selectedProduct.category}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Información de inventario */}
                <Card className="h-full">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Inventario</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                <span className="text-muted-foreground">Stock Actual:</span>
                                <span
                                    className={`text-lg font-bold ${
                                        selectedProduct.stock === 0
                                            ? 'text-red-600'
                                            : selectedProduct.stock < selectedProduct.min_stock
                                              ? 'text-yellow-600'
                                              : 'text-green-600'
                                    }`}
                                >
                                    {selectedProduct.stock}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                <span className="text-muted-foreground">Stock Mínimo:</span>
                                <span className="font-semibold">{selectedProduct.min_stock}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Diferencia:</span>
                                <span
                                    className={`font-semibold ${
                                        selectedProduct.stock - selectedProduct.min_stock >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {selectedProduct.stock - selectedProduct.min_stock > 0 ? '+' : ''}
                                    {selectedProduct.stock - selectedProduct.min_stock}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Estado del stock */}
                <Card className="h-full">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            <h3 className="text-lg font-semibold">Estado del Stock</h3>
                        </div>
                        {(() => {
                            const stockStatus = getStockStatus(selectedProduct.stock, selectedProduct.min_stock);
                            const StatusIcon = stockStatus.icon;
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <StatusIcon className={`h-8 w-8 ${stockStatus.textColor}`} />
                                        <div>
                                            <div className={`text-lg font-bold ${stockStatus.textColor}`}>{stockStatus.label}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{stockStatus.description}</p>
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
