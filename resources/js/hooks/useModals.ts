import { useState, useCallback } from 'react';
import { Product } from '@/types/products';

export const useModals = () => {
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

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
        closeDeleteConfirm
    };
};