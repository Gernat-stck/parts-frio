import { useState, useCallback } from 'react';
import { Product } from '@/types/products';
import { initialInventoryData } from '@/data/inventory-data';

export const useInventoryData = () => {
    const [inventoryData, setInventoryData] = useState<Product[]>(initialInventoryData);

    const createProduct = useCallback((productData: Omit<Product, 'id'>) => {
        const newId = Math.max(...inventoryData.map((p) => p.id)) + 1;
        const newProduct: Product = { ...productData, id: newId };
        setInventoryData((prev) => [...prev, newProduct]);
    }, [inventoryData]);

    const updateProduct = useCallback((updatedProduct: Product) => {
        setInventoryData((prev) => 
            prev.map((product) => 
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    }, []);

    const deleteProduct = useCallback((productId: number) => {
        setInventoryData((prev) => prev.filter((product) => product.id !== productId));
    }, []);

    return {
        inventoryData,
        createProduct,
        updateProduct,
        deleteProduct
    };
};