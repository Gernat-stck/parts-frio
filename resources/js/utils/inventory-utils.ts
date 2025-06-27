import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export interface StockStatus {
    status: 'normal' | 'bajo' | 'critico' | 'sin-stock';
    label: string;
    description: string;
    color: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const getStockStatus = (stock: number, minStock: number): StockStatus => {
    if (stock === 0) {
        return {
            status: 'sin-stock',
            label: 'Sin Stock',
            description: 'Producto agotado',
            color: 'border-l-gray-500',
            textColor: 'text-gray-600',
            icon: XCircle
        };
    }
    
    if (stock <= minStock * 0.5) {
        return {
            status: 'critico',
            label: 'Stock Crítico',
            description: 'Reabastecimiento urgente',
            color: 'border-l-red-500',
            textColor: 'text-red-600',
            icon: AlertCircle
        };
    }
    
    if (stock <= minStock) {
        return {
            status: 'bajo',
            label: 'Stock Bajo',
            description: 'Considerar reabastecimiento',
            color: 'border-l-yellow-500',
            textColor: 'text-yellow-600',
            icon: AlertTriangle
        };
    }
    
    return {
        status: 'normal',
        label: 'Stock Normal',
        description: 'Inventario en niveles óptimos',
        color: 'border-l-green-500',
        textColor: 'text-green-600',
        icon: CheckCircle
    };
};