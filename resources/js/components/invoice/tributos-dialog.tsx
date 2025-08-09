import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TRIBUTOS_OPTIONS } from '@/constants/salesConstants';
import { BodyDocument } from '@/types/invoice';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TributosDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    item: BodyDocument | null;
    onAddTributo: (tributoValue: string) => void;
    onRemoveTributo: (tributoValue: string) => void;
}

export function TributosDialog({ isOpen, onOpenChange, item, onAddTributo, onRemoveTributo }: TributosDialogProps) {
    const [selectedTributo, setSelectedTributo] = useState<string>('');

    const handleAdd = () => {
        if (selectedTributo && item?.tributos) {
            onAddTributo(selectedTributo);
            setSelectedTributo(''); // Reinicia el select después de agregar
        }
    };

    if (!item) {
        return null; // No renderiza el diálogo si no hay un ítem seleccionado
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] gap-4">
                <DialogHeader>
                    <DialogTitle>Tributos del Ítem</DialogTitle>
                    <DialogDescription>Administra los tributos aplicados al ítem "{item.descripcion || ''}".</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Selector para agregar un nuevo tributo */}
                    <div className="flex items-center gap-2">
                        <Select onValueChange={setSelectedTributo} value={selectedTributo}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un tributo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TRIBUTOS_OPTIONS.map((tributo) => (
                                    <SelectItem key={tributo.value} value={tributo.value}>
                                        {tributo.value} - {tributo.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAdd} disabled={!selectedTributo || item.tributos?.includes(selectedTributo)}>
                            Agregar
                        </Button>
                    </div>

                    {/* Lista de tributos aplicados */}
                    <div className="space-y-2">
                        {/* Filtrar y mapear solo si item.tributos es un array de strings válidos */}
                        {item.tributos && Array.isArray(item.tributos) && item.tributos.length > 0 ? (
                            item.tributos
                                .filter((tributoValue): tributoValue is string => typeof tributoValue === 'string')
                                .map((tributoValue) => {
                                    const tributo = TRIBUTOS_OPTIONS.find((t) => t.value === tributoValue);
                                    return (
                                        <div key={tributoValue} className="flex items-center justify-between rounded-md border p-2">
                                            <span>
                                                [{tributo?.value || `Tributo desconocido (${tributoValue})`}] - {tributo?.label || `Tributo desconocido (${tributoValue})`}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRemoveTributo(tributoValue)}
                                                aria-label={`Eliminar tributo`}
                                                disabled = {tributo?.value === '20'}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    );
                                })
                        ) : (
                            <p className="text-sm text-muted-foreground">Este ítem no tiene tributos aplicados.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
