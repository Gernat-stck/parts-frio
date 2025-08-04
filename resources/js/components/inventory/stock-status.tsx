import { Badge } from '@/components/ui/badge';

interface Props {
    stock: number;
    min: number;
}

export function StockStatus({ stock, min }: Props) {
    const low = stock <= min;
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge variant={low ? 'destructive' : 'secondary'} className="w-fit text-xs sm:text-sm">
                {low ? 'Stock Bajo' : 'Stock Normal'}
            </Badge>
            <span className="text-xs text-gray-600 sm:text-sm">{stock} unidades</span>
        </div>
    );
}
