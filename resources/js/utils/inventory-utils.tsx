import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Determina el estado del stock de un producto basado en la cantidad actual y el mínimo requerido
 * 
 * @param stock - Cantidad actual en stock
 * @param minStock - Cantidad mínima de stock deseada
 * @returns Objeto con información de estado, etiqueta, colores y descripción
 */
export const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) {
        return {
            status: 'sin-stock',
            label: 'Sin Stock',
            color: 'border-l-gray-500',
            textColor: 'text-gray-500',
            icon: XCircle,
            description: 'Producto agotado - Reabastecer inmediatamente',
        };
    } else if (stock < minStock * 0.5) {
        return {
            status: 'critico',
            label: 'Stock Crítico',
            color: 'border-l-red-500',
            textColor: 'text-red-800',
            icon: AlertTriangle,
            description: 'Stock crítico - Reabastecer urgentemente',
        };
    } else if (stock < minStock) {
        return {
            status: 'bajo',
            label: 'Stock Bajo',
            color: 'border-l-yellow-500',
            textColor: 'text-yellow-800',
            icon: AlertTriangle,
            description: 'Stock por debajo del mínimo - Considerar reabastecimiento',
        };
    } else {
        return {
            status: 'normal',
            label: 'Stock Normal',
            color: 'border-l-green-500',
            textColor: 'text-green-500',
            icon: CheckCircle,
            description: 'Stock en niveles normales',
        };
    }
};

/**
 * Tipo para el resultado de getStockStatus
 */
export type StockStatus = ReturnType<typeof getStockStatus>;