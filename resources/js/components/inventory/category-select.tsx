import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import { CategoryDialog } from './category-dialog';
import { Label } from '../ui/label';

interface Props {
    value: string;
    onChange: (val: string) => void;
    custom: string[];
    onAddCustom: (cat: string) => void;
    allStatic: string[];
    error?: string;
}

export function CategorySelect({ value, onChange, custom, onAddCustom, allStatic, error }: Props) {
    const merged = useMemo(() => [...allStatic, ...custom].sort(), [allStatic, custom]);

    return (
        <div className="space-y-1">
                <Label className="text-sm font-medium">Categoría</Label>
            <div className="flex gap-2">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={error ? 'border-red-500' : undefined}>
                        <SelectValue placeholder="Selecciona Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {merged.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                                {custom.includes(cat) && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                        Personalizada
                                    </Badge>
                                )}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <CategoryDialog existing={merged} onAdd={onAddCustom} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
