import { useState, useMemo } from 'react';
import { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';

interface UseInventoryFiltersProps {
    inventoryData: Product[];
}

export const useInventoryFilters = ({ inventoryData }: UseInventoryFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    const filteredData = useMemo(() => {
        return inventoryData.filter((item) => {
            const matchesSearch = 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            
            const stockStatus = getStockStatus(item.stock, item.minStock).status;
            const matchesStock = stockFilter === 'all' || stockFilter === stockStatus;

            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [searchTerm, categoryFilter, stockFilter, inventoryData]);

    const categories = useMemo(() => 
        [...new Set(inventoryData.map((item) => item.category))], 
        [inventoryData]
    );

    return {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        stockFilter,
        setStockFilter,
        filteredData,
        categories
    };
};