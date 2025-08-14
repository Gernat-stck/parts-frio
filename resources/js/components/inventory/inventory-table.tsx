import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';
import { CloudUploadIcon, Edit, MoreHorizontal, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import NoData from '../187443387_10810386.png';
import { ScrollArea } from '../ui/scroll-area';
import ItemDetails from './item-detail';

interface InventoryTableProps {
    data: Product[];
    isAdmin: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onAddStock: (productCode: string) => void;
}

export const InventoryTable = ({ data, isAdmin, onEdit, onDelete, onAddStock }: InventoryTableProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Card className="p-0">
                    <CardContent className="px-0 py-2">
                        <div className="overflow-x-auto">
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
                                    {data.map((item) => {
                                        const stockStatus = getStockStatus(item.stock, item.min_stock);
                                        const StatusIcon = stockStatus.icon;
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer transition-colors hover:bg-muted/50"
                                                onClick={() => handleRowClick(item)}
                                            >
                                                <TableCell
                                                    className={`p-2 ${stockStatus.status === 'critico' ? 'animated-border-red' : `border-l-4 ${stockStatus.color}`}`}
                                                >
                                                    <div className="relative h-12 max-h-16 w-12 md:h-16 md:w-16">
                                                        <img
                                                            src={`/private/${item.img_product}`}
                                                            alt={item.product_name}
                                                            className="h-full w-full rounded-lg object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = NoData;
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <div className="space-y-1">
                                                        <div
                                                            className={`line-clamp-1 text-sm font-medium md:text-base ${item.stock === 0 ? 'line-through opacity-50' : ''}`}
                                                        >
                                                            {item.product_name}
                                                        </div>
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
                                                    <div
                                                        className={`text-sm font-medium md:text-base ${item.stock === 0 ? 'line-through opacity-50' : ''}`}
                                                    >
                                                        ${item.price}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium">{item.stock}</div>
                                                        <div className="text-xs opacity-60">Mín: {item.min_stock}</div>
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
                                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Administrar producto</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onAddStock(item.product_code);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <CloudUploadIcon className="mr-2 h-4 w-4" />
                                                                    Actualizar Stock
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEdit(item);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDelete(item);
                                                                    }}
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
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
                <div className="space-y-3">
                    {data.map((item) => {
                        const stockStatus = getStockStatus(item.stock, item.min_stock);
                        const StatusIcon = stockStatus.icon;
                        return (
                            <Card
                                key={item.id}
                                className={`cursor-pointer transition-colors hover:bg-muted/30 ${stockStatus.status === 'critico' ? 'border-l-4 border-red-500' : ''}`}
                                onClick={() => handleRowClick(item)}
                            >
                                <CardContent className="p-3 sm:p-4">
                                    <div className="space-y-3">
                                        {/* Header Row */}
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-12 w-12 flex-shrink-0 sm:h-16 sm:w-16">
                                                <img
                                                    src={`/private/${item.img_product}`}
                                                    alt={item.product_name}
                                                    className="h-full w-full rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = NoData;
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className={`text-sm leading-tight font-medium break-words sm:text-base ${item.stock === 0 ? 'line-through opacity-50' : ''}`}
                                                >
                                                    {item.product_name}
                                                </div>
                                                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{item.description}</div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.category}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            stockStatus.status === 'critico'
                                                                ? 'destructive'
                                                                : stockStatus.status === 'bajo'
                                                                  ? 'default'
                                                                  : 'secondary'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {stockStatus.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {isAdmin && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onAddStock(item.product_code);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <CloudUploadIcon className="mr-2 h-4 w-4" />
                                                            Actualizar Stock
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(item);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(item);
                                                            }}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <div className="text-xs text-muted-foreground">Precio</div>
                                                <div className={`mt-1 font-medium ${item.stock === 0 ? 'line-through opacity-50' : ''}`}>
                                                    ${item.price}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Stock</div>
                                                <div className="mt-1">
                                                    <span className="font-medium">{item.stock}</span>
                                                    <span className="ml-1 text-xs text-muted-foreground">/ Mín: {item.min_stock}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Description */}
                                        <div className="text-xs text-muted-foreground">{stockStatus.description}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Modal de detalles del producto */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="mx-2 w-[calc(100vw-1rem)] max-w-[89vw] overflow-y-auto sm:mx-4 sm:w-full md:max-w-[80vw] lg:max-w-[75vw] xl:max-w-[70vw]">
                    <ScrollArea className="h-[90vh] w-full p-2">
                        <DialogHeader className="pb-0">
                            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                                Detalles del Producto
                            </DialogTitle>
                        </DialogHeader>
                        {selectedProduct && <ItemDetails selectedProduct={selectedProduct} />}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
};
