import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StockLegendItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
    color: string;
    textColor: string;
}

const stockLegendItems: StockLegendItem[] = [
    {
        icon: CheckCircle,
        label: 'Stock Normal',
        description: 'Inventario en niveles óptimos',
        color: 'text-green-600',
        textColor: 'text-green-700',
    },
    {
        icon: AlertTriangle,
        label: 'Stock Bajo',
        description: 'Considerar reabastecimiento',
        color: 'text-yellow-600',
        textColor: 'text-yellow-700',
    },
    {
        icon: AlertCircle,
        label: 'Stock Crítico',
        description: 'Reabastecimiento urgente',
        color: 'text-red-600',
        textColor: 'text-red-700',
    },
    {
        icon: XCircle,
        label: 'Sin Stock',
        description: 'Producto agotado',
        color: 'text-gray-600',
        textColor: 'text-gray-700',
    },
];

export const StockLegend = () => {
    return (
        <Card className="border-0 ">
            <CardHeader className="pt-3">
                <CardTitle className="text-base font-semibold sm:text-lg">Leyenda de Estados de Stock</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {stockLegendItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div key={item.label} className="flex items-start gap-2 rounded-lg bg-accent/50 p-3 sm:gap-3">
                                <IconComponent className={`mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 ${item.color}`} />
                                <div className="min-w-0 flex-1">
                                    <div className={`text-sm font-medium sm:text-base ${item.textColor}`}>{item.label}</div>
                                    <div className="text-xs sm:text-sm dark:text-gray-400">{item.description}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-3 ">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div className="text-xs text-blue-700 sm:text-sm dark:text-blue-400">
                            <strong>Nota:</strong> Los productos con stock crítico aparecen con borde rojo animado para mayor visibilidad. El estado
                            se calcula comparando el stock actual con el stock mínimo configurado.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
