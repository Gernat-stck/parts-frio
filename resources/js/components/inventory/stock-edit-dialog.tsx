import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface StockEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productCode: string;
    onEditStock: (productCode: string, action: 'add' | 'subtract', quantity: number) => void;
}

export function StockEditDialog({ open, onOpenChange, productCode, onEditStock }: StockEditDialogProps) {
    const [action, setAction] = useState<'add' | 'subtract'>('add');
    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (value: string) => {
        const numValue = Number.parseInt(value) || 0;
        if (numValue >= 0) {
            setQuantity(numValue);
        }
    };

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(0, prev - 1));
    };

    const handleSubmit = () => {
        if (quantity > 0) {
            onEditStock(productCode, action, quantity);
            onOpenChange(false);
            // Reset form
            setAction('add');
            setQuantity(1);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        // Reset form
        setAction('add');
        setQuantity(1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Stock</DialogTitle>
                    <DialogDescription>
                        Ajusta el inventario del producto: <strong>{productCode}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Action Selector */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="action" className="text-right">
                            Acción
                        </Label>
                        <div className="col-span-3">
                            <Select value={action} onValueChange={(value: 'add' | 'subtract') => setAction(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una acción" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Agregar Stock</SelectItem>
                                    <SelectItem value="subtract">Eliminar Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Quantity Input with Buttons */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Cantidad
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 0}>
                                <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                                className="text-center"
                                min="0"
                            />

                            <Button type="button" variant="outline" size="icon" onClick={incrementQuantity}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={quantity <= 0}
                        className={action === 'subtract' ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                        {action === 'add' ? 'Agregar' : 'Eliminar'} {quantity} unidad{quantity !== 1 ? 'es' : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
