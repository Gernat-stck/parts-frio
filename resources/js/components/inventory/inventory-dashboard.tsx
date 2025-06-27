import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Auth } from '@/types';
import { Product } from '@/types/products';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useModals } from '@/hooks/useModals';
import { Pagination } from '../ui/pagination';
import { DeleteConfirmation } from '../delete-confirmation';
import { ProductForm } from './product-form';
import { InventoryFilters } from './inventory-filters';
import { InventoryTable } from './inventory-table';
import { StockLegend } from './stock-legend';

interface InventoryDashboardProps {
    auth: Auth;
}

export default function InventoryDashboard({ auth }: InventoryDashboardProps) {
    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'super-admin';
    
    // Custom hooks
    const { inventoryData, createProduct, updateProduct, deleteProduct } = useInventoryData();
    const {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        stockFilter,
        setStockFilter,
        filteredData,
        categories
    } = useInventoryFilters({ inventoryData });
    
    const {
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
    } = useModals();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Product[]>([]);
    const itemsPerPage = 5;

    // Handlers
    const handleProductFormSubmit = useCallback((productData: Omit<Product, 'id'> | Product) => {
        if (formMode === 'create') {
            createProduct(productData as Omit<Product, 'id'>);
        } else {
            updateProduct(productData as Product);
        }
        closeProductForm();
    }, [formMode, createProduct, updateProduct, closeProductForm]);

    const handleDeleteConfirm = useCallback(() => {
        if (deletingProduct) {
            deleteProduct(deletingProduct.id);
            closeDeleteConfirm();
        }
    }, [deletingProduct, deleteProduct, closeDeleteConfirm]);

    const handlePaginatedData = useCallback((data: Product[]) => {
        setPaginatedData(data);
    }, []);

    return (
        <ScrollArea className="h-full w-full">
            <div className="p-2">
                <div className="mx-auto max-w-7xl space-y-2 md:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold md:text-3xl">Gestión de Inventario</h1>
                            <p className="mt-1 text-sm opacity-70 md:text-base">
                                Monitorea y administra tu inventario en tiempo real
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Button onClick={openCreateForm} className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Agregar Producto</span>
                                    <span className="sm:hidden">Agregar</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filtros */}
                    <InventoryFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        categoryFilter={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                        stockFilter={stockFilter}
                        onStockChange={setStockFilter}
                        categories={categories}
                    />

                    {/* Tabla */}
                    <InventoryTable
                        data={paginatedData}
                        isAdmin={isAdmin}
                        onEdit={openEditForm}
                        onDelete={openDeleteConfirm}
                    />

                    {/* Paginación */}
                    <Pagination
                        data={filteredData}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onPaginatedData={handlePaginatedData}
                        pageInfo={{
                            itemName: 'productos',
                        }}
                        maxPageButtons={5}
                    />

                    {/* Leyenda */}
                    <StockLegend />

                    {/* Modales */}
                    <ProductForm
                        isOpen={isProductFormOpen}
                        onClose={closeProductForm}
                        onSubmit={handleProductFormSubmit}
                        product={editingProduct}
                        mode={formMode}
                    />
                    
                    <DeleteConfirmation
                        isOpen={isDeleteConfirmOpen}
                        onClose={closeDeleteConfirm}
                        onConfirm={handleDeleteConfirm}
                        productName={deletingProduct?.name || ''}
                    />
                </div>
            </div>
        </ScrollArea>
    );
}
