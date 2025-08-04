import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function CategoryDialog({ existing, onAdd }: { existing: string[]; onAdd: (cat: string) => void }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    function handleAdd() {
        const formatted = value.trim();
        if (!formatted) return;
        if (existing.includes(formatted)) return;

        onAdd(formatted);
        setValue('');
        setOpen(false); // cerrar modal
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                + Nueva
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Categoría</DialogTitle>
                </DialogHeader>
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Nombre de la categoría" />
                <DialogFooter>
                    <Button onClick={handleAdd}>Agregar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
