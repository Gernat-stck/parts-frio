import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    stockFilter: string;
    onStockChange: (value: string) => void;
    categories: string[];
}

export const InventoryFilters = ({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    stockFilter,
    onStockChange,
    categories
}: InventoryFiltersProps) => {
    return (
        <Card className="border-0">
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform opacity-50" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Select value={categoryFilter} onValueChange={onCategoryChange}>
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
                        <Select value={stockFilter} onValueChange={onStockChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="normal">Stock Normal</SelectItem>
                                <SelectItem value="bajo">Stock Bajo</SelectItem>
                                <SelectItem value="critico">Stock Crítico</SelectItem>
                                <SelectItem value="sin-stock">Sin Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};