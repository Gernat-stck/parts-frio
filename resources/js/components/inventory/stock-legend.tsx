import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        textColor: 'text-green-700'
    },
    {
        icon: AlertTriangle,
        label: 'Stock Bajo',
        description: 'Considerar reabastecimiento',
        color: 'text-yellow-600',
        textColor: 'text-yellow-700'
    },
    {
        icon: AlertCircle,
        label: 'Stock Crítico',
        description: 'Reabastecimiento urgente',
        color: 'text-red-600',
        textColor: 'text-red-700'
    },
    {
        icon: XCircle,
        label: 'Sin Stock',
        description: 'Producto agotado',
        color: 'text-gray-600',
        textColor: 'text-gray-700'
    }
];

export const StockLegend = () => {
    return (
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Leyenda de Estados de Stock</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {stockLegendItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20"
                            >
                                <IconComponent className={`mt-0.5 h-5 w-5 flex-shrink-0 ${item.color}`} />
                                <div className="min-w-0 flex-1">
                                    <div className={`font-medium ${item.textColor}`}>
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Nota:</strong> Los productos con stock crítico aparecen con borde rojo 
                            animado para mayor visibilidad. El estado se calcula comparando el stock actual 
                            con el stock mínimo configurado.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};