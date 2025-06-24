import { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function InventoryWidget({ inventoryData }: { inventoryData: Product[] }) {
    // Estadísticas del inventario
    const stats = useMemo(() => {
        const total = inventoryData.length;
        const sinStock = inventoryData.filter((item) => item.stock === 0).length;
        const stockBajo = inventoryData.filter((item) => {
            const status = getStockStatus(item.stock, item.minStock).status;
            return status === 'bajo' || status === 'critico';
        }).length;
        const stockNormal = total - sinStock - stockBajo;

        return { total, sinStock, stockBajo, stockNormal };
    }, [inventoryData]);

    return (
        <>
            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium dark:text-gray-400">Total Productos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-gray-400">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium dark:text-gray-400">Stock Normal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.stockNormal}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium dark:text-gray-400">Stock Bajo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.stockBajo}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium dark:text-gray-400">Sin Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.sinStock}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
