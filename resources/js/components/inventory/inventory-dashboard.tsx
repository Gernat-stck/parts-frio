import { ScrollArea } from '@/components/ui/scroll-area';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useModals } from '@/hooks/useModals';
import { Auth } from '@/types';
import { Product } from '@/types/products';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { DeleteConfirmation } from '../delete-confirmation';
import EmptyState from '../empty-state';
import { Button } from '../ui/button';
import { Pagination } from '../ui/pagination';
import { InventoryFilters } from './inventory-filters';
import { InventoryTable } from './inventory-table';
import { StockLegend } from './stock-legend';

interface InventoryDashboardProps {
    auth: Auth;
    inventoryData: Product[]; // Optional prop for initial data
}

export default function InventoryDashboard({ auth, inventoryData }: InventoryDashboardProps) {
    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'super-admin';
    // Custom hooks
    const { searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, stockFilter, setStockFilter, filteredData, categories } =
        useInventoryFilters({ inventoryData });

    const { isDeleteConfirmOpen, deletingProduct, openDeleteConfirm, closeDeleteConfirm } = useModals();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Product[]>([]);
    const itemsPerPage = 5;

    const handleDeleteConfirm = useCallback(() => {
        if (deletingProduct) {
            closeDeleteConfirm();
            router.delete(route('admin.inventory.delete', { id: deletingProduct.product_code }));
        }
    }, [deletingProduct, closeDeleteConfirm]);

    const handlePaginatedData = useCallback((data: Product[]) => {
        setPaginatedData(data);
    }, []);

    const gotoEditForm = useCallback((product: Product) => {
        router.get(route('admin.inventory.edit', { id: product.product_code }));
    }, []);

    const handleCreate = useCallback(() => {
        router.get(route('admin.inventory.create'));
    }, []);

    return (
        <ScrollArea className="h-full w-full">
            <div className="p-2">
                <div className="mx-auto max-w-7xl space-y-2">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold md:text-3xl">Gestión de Inventario</h1>
                            <p className="mt-1 text-sm opacity-70 md:text-base">Monitorea y administra tu inventario en tiempo real</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Link href={route('admin.inventory.create')}>
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Agregar Producto</span>
                                        <span className="sm:hidden">Agregar</span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {inventoryData.length !== 0 && (
                        <>
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
                            <InventoryTable data={paginatedData} isAdmin={isAdmin} onEdit={gotoEditForm} onDelete={openDeleteConfirm} />

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
                            <StockLegend />
                        </>
                    )}
                    {inventoryData.length === 0 && (
                        <div className="flex w-full items-center justify-center">
                            <EmptyState
                                type="no-products"
                                actions={[
                                    {
                                        label: 'Crear Producto',
                                        onClick: handleCreate,
                                        icon: <Plus className="h-4 w-4" />,
                                    },
                                ]}
                            />
                        </div>
                    )}

                    {/* Leyenda */}

                    <DeleteConfirmation
                        isOpen={isDeleteConfirmOpen}
                        onClose={closeDeleteConfirm}
                        onConfirm={handleDeleteConfirm}
                        productName={deletingProduct?.product_name || ''}
                    />
                </div>
            </div>
        </ScrollArea>
    );
}
