import type { Product } from '@/types/products';
import { useCallback, useState } from 'react';

export const useModals = () => {
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [isUpdateStock, setIsUpdateStock] = useState(false);
    const [updatingStockCode, setIsUpdatingStock] = useState<string>('');

    const openCreateForm = useCallback(() => {
        setFormMode('create');
        setEditingProduct(null);
        setIsProductFormOpen(true);
    }, []);

    const openEditForm = useCallback((product: Product) => {
        setFormMode('edit');
        setEditingProduct(product);
        setIsProductFormOpen(true);
    }, []);

    const openDeleteConfirm = useCallback((product: Product) => {
        setDeletingProduct(product);
        setIsDeleteConfirmOpen(true);
    }, []);

    const closeProductForm = useCallback(() => {
        setIsProductFormOpen(false);
        setEditingProduct(null);
    }, []);

    const closeDeleteConfirm = useCallback(() => {
        setIsDeleteConfirmOpen(false);
        setDeletingProduct(null);
    }, []);

    const openAddStockModal = useCallback((productCode: string) => {
        setIsUpdateStock(true);
        setIsUpdatingStock(productCode);
    }, []);

    const closeStockModal = useCallback(() => {
        setIsUpdateStock(false);
        setIsUpdatingStock('');
    }, []);

    return {
        isProductFormOpen,
        isDeleteConfirmOpen,
        editingProduct,
        deletingProduct,
        formMode,
        openCreateForm,
        openEditForm,
        openDeleteConfirm,
        closeProductForm,
        closeDeleteConfirm,
        openAddStockModal,
        isUpdateStock,
        updatingStockCode,
        closeStockModal,
    };
};
