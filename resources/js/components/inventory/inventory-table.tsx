import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product } from '@/types/products';
import { getStockStatus } from '@/utils/inventory-utils';
import NoData from '../187443387_10810386.png';

interface InventoryTableProps {
    data: Product[];
    isAdmin: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const InventoryTable = ({ data, isAdmin, onEdit, onDelete }: InventoryTableProps) => {
    return (
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
                        {data.map((item) => {
                            console.log('Processing item:', item);
                            const stockStatus = getStockStatus(item.stock, item.minStock);
                            const StatusIcon = stockStatus.icon;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell
                                        className={`p-2 ${stockStatus.status === 'critico' ? 'animated-border-red' : `border-l-4 ${stockStatus.color}`}`}
                                    >
                                        <div className="relative h-12 max-h-16 w-12 md:h-16 md:w-16">
                                            <img
                                                src={item.image || NoData}
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
                                                    <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(item)}
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
    );
};