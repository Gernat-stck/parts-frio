import { AlertTriangle, CheckCircle, Edit, MoreHorizontal, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Auth } from '@/types';
import { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';
import  NoData  from '../187443387_10810386.png';
import { DeleteConfirmation } from '../delete-confirmation';
import { Pagination } from '../ui/pagination';
import { ProductForm } from './product-form';
interface InventoryDashboardProps {
    auth: Auth;
}

export default function InventoryDashboard({ auth }: InventoryDashboardProps) {
    const isAdmin = true;
    console.log('isAdmin', isAdmin, auth);
    // Initial inventory data
    const initialInventoryData: Product[] = [
        {
            id: 1,
            name: 'Laptop Dell XPS 13',
            description: 'Laptop ultrabook con procesador Intel i7, 16GB RAM, 512GB SSD',
            price: 1299.99,
            stock: 2,
            minStock: 10,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Electrónicos',
        },
        {
            id: 2,
            name: 'Mouse Inalámbrico Logitech',
            description: 'Mouse ergonómico con conectividad Bluetooth y USB',
            price: 45.99,
            stock: 25,
            minStock: 15,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Accesorios',
        },
        {
            id: 3,
            name: 'Monitor 4K Samsung',
            description: 'Monitor 27 pulgadas 4K UHD con tecnología HDR',
            price: 399.99,
            stock: 0,
            minStock: 5,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Electrónicos',
        },
        {
            id: 4,
            name: 'Teclado Mecánico RGB',
            description: 'Teclado mecánico con switches Cherry MX y retroiluminación RGB',
            price: 129.99,
            stock: 8,
            minStock: 12,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Accesorios',
        },
        {
            id: 5,
            name: 'Auriculares Sony WH-1000XM4',
            description: 'Auriculares inalámbricos con cancelación de ruido activa',
            price: 299.99,
            stock: 15,
            minStock: 8,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Audio',
        },
        {
            id: 6,
            name: 'Tablet iPad Air',
            description: 'Tablet Apple iPad Air con chip M1 y pantalla Liquid Retina',
            price: 599.99,
            stock: 3,
            minStock: 6,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Electrónicos',
        },
        {
            id: 7,
            name: 'Cámara Canon EOS R6',
            description: 'Cámara mirrorless full frame con estabilización de imagen',
            price: 2499.99,
            stock: 12,
            minStock: 4,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Fotografía',
        },
        {
            id: 8,
            name: 'Disco Duro Externo 2TB',
            description: 'Disco duro portátil USB 3.0 con 2TB de capacidad',
            price: 89.99,
            stock: 30,
            minStock: 20,
            image: '/placeholder.svg?height=80&width=80',
            category: 'Almacenamiento',
        },
    ];

    const [inventoryData, setInventoryData] = useState<Product[]>(initialInventoryData);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modal states
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    // CRUD Functions
    const handleCreateProduct = (productData: Omit<Product, 'id'>) => {
        const newId = Math.max(...inventoryData.map((p) => p.id)) + 1;
        const newProduct: Product = { ...productData, id: newId };
        setInventoryData((prev) => [...prev, newProduct]);
    };

    const handleEditProduct = (updatedProduct: Product) => {
        setInventoryData((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));
    };

    const handleDeleteProduct = () => {
        if (deletingProduct) {
            setInventoryData((prev) => prev.filter((product) => product.id !== deletingProduct.id));
            setDeletingProduct(null);
            setIsDeleteConfirmOpen(false);
        }
    };

    const handleProductFormSubmit = (productData: Omit<Product, 'id'> | Product) => {
        if (formMode === 'create') {
            handleCreateProduct(productData as Omit<Product, 'id'>);
        } else {
            handleEditProduct(productData as Product);
        }
        setEditingProduct(null);
    };

    // Modal handlers
    const openCreateForm = () => {
        setFormMode('create');
        setEditingProduct(null);
        setIsProductFormOpen(true);
    };

    const openEditForm = (product: Product) => {
        setFormMode('edit');
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };

    const openDeleteConfirm = (product: Product) => {
        setDeletingProduct(product);
        setIsDeleteConfirmOpen(true);
    };

    // Filtrar datos
    const filteredData = useMemo(() => {
        return inventoryData.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            const stockStatus = getStockStatus(item.stock, item.minStock).status;
            const matchesStock = stockFilter === 'all' || stockFilter === stockStatus;

            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [searchTerm, categoryFilter, stockFilter, inventoryData]);

    // Paginación
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const categories = [...new Set(inventoryData.map((item) => item.category))];

    return (
        <div className="p-2">
            <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">Gestión de Inventario</h1>
                        <p className="mt-1 text-sm opacity-70 md:text-base">Monitorea y administra tu inventario en tiempo real</p>
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
                {/* Filtros y Búsqueda */}
                <Card className="border-0">
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform opacity-50" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                                <Select value={stockFilter} onValueChange={setStockFilter}>
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
                {/* Tabla de Inventario */}
                <Card className="p-0">
                    <CardContent className="px-0 py-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 md:w-20">Imagen</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Estado</TableHead>
                                    {isAdmin && <TableHead className="mr-2 w-16">Acciones</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((item) => {
                                    const stockStatus = getStockStatus(item.stock, item.minStock);
                                    const StatusIcon = stockStatus.icon;
                                    console.log('stockStatus', stockStatus);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell
                                                className={`p-2 ${stockStatus.status === 'critico' ? 'animated-border-red' : `border-l-4 ${stockStatus.color}`}`}
                                            >
                                                <div className="relative h-12 max-h-16 w-12 md:h-16 md:w-16">
                                                    <img
                                                        src={
                                                            //item.image ||
                                                            NoData
                                                        }
                                                        alt={item.name}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <div className="space-y-1">
                                                    <div className="line-clamp-1 text-sm font-medium md:text-base">{item.name}</div>
                                                    <div className="line-clamp-2 text-xs opacity-70 md:line-clamp-1 md:text-sm">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden p-2 md:table-cell">
                                                <Badge variant="outline" className="text-xs">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <div className="text-sm font-medium md:text-base">${item.price.toFixed(2)}</div>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium">{item.stock}</div>
                                                    <div className="text-xs opacity-60">Mín: {item.minStock}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <StatusIcon className="h-3 w-3 flex-shrink-0 md:h-4 md:w-4" />
                                                        <span
                                                            className={`text-xs font-medium md:text-sm ${stockStatus.textColor} max-w-30 break-words`}
                                                        >
                                                            {stockStatus.label}
                                                        </span>
                                                    </div>
                                                    <div className={`max-w-30 text-xs text-wrap font-stretch-normal opacity-60`}>
                                                        {stockStatus.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="p-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Administrar producto</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem onClick={() => openEditForm(item)} className="cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteConfirm(item)}
                                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {/* Paginación */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    pageInfo={{
                        startIndex: startIndex + 1,
                        endIndex: Math.min(startIndex + itemsPerPage, filteredData.length),
                        total: filteredData.length,
                        itemName: 'productos',
                    }}
                    maxPageButtons={5}
                />
                {/* Leyenda de Estados */}
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="text-lg">Leyenda de Estados de Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-3 rounded-lg border border-green-500 p-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <div className="font-medium text-green-800">Stock Normal</div>
                                    <div className="text-xs text-green-600">Por encima del mínimo</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-yellow-500 p-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <div className="font-medium text-yellow-800">Stock Bajo</div>
                                    <div className="text-xs text-yellow-600">Por debajo del mínimo</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-red-500 p-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <div>
                                    <div className="font-medium text-red-800">Stock Crítico</div>
                                    <div className="text-xs text-red-600">Menos del 50% del mínimo</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-gray-500 p-3">
                                <XCircle className="h-5 w-5 text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-800">Sin Stock</div>
                                    <div className="text-xs text-gray-600">Producto agotado</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Modals */}
                <ProductForm
                    isOpen={isProductFormOpen}
                    onClose={() => setIsProductFormOpen(false)}
                    onSubmit={handleProductFormSubmit}
                    product={editingProduct}
                    mode={formMode}
                />
                <DeleteConfirmation
                    isOpen={isDeleteConfirmOpen}
                    onClose={() => setIsDeleteConfirmOpen(false)}
                    onConfirm={handleDeleteProduct}
                    productName={deletingProduct?.name || ''}
                />
            </div>
        </div>
    );
}
