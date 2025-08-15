import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { AnulacionForm } from './anulacion-form';
import { Factura } from '@/types/invoice';

interface AnulacionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venta: Factura | null;
    clearFilter?: () => void;
}

const tiposAnulacion = [
    {
        id: 1,
        titulo: 'Anulación por sustitución',
        descripcion: 'Se anula el documento para ser sustituido por otro',
        requiereCodigoR: true,
        value: '01'
    },
    {
        id: 2,
        titulo: 'Anulación por descarte',
        descripcion: 'Se anula el documento sin sustitución',
        requiereCodigoR: false,
        value: '02'
    },
    {
        id: 3,
        titulo: 'Anulación por corrección',
        descripcion: 'Se anula para corregir errores en el documento',
        requiereCodigoR: true,
    },
];

export function AnulacionDialog({ open, onOpenChange, venta }: AnulacionDialogProps) {
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);

    const handleTipoSelect = (tipo: number) => {
        setTipoSeleccionado(tipo);
        setStep('form');
    };

    const handleBack = () => {
        setStep('select');
        setTipoSeleccionado(null);
    };

    const handleClose = () => {
        setStep('select');
        setTipoSeleccionado(null);
        onOpenChange(false);
    };

    if (!venta) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{step === 'select' ? 'Seleccionar Tipo de Anulación' : 'Formulario de Anulación'}</DialogTitle>
                    <DialogDescription>
                        {step === 'select'
                            ? 'Seleccione el tipo de anulación que desea realizar para el DTE'
                            : `Completar datos para anulación tipo ${tipoSeleccionado}`}
                    </DialogDescription>
                </DialogHeader>

                {step === 'select' && (
                    <div className="grid gap-4 py-4">
                        <div className="mb-4 rounded-lg bg-muted p-4">
                            <h4 className="mb-2 font-semibold">Documento a Anular:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <strong>Código:</strong> {venta.codigoGeneracion}
                                </div>
                                <div>
                                    <strong>Control:</strong> {venta.numeroControl}
                                </div>
                                <div>
                                    <strong>Cliente:</strong> {venta.receptor}
                                </div>
                                <div>
                                    <strong>Monto:</strong> ${venta.monto.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {tiposAnulacion.map((tipo) => (
                                <Card
                                    key={tipo.id}
                                    className="cursor-pointer transition-colors hover:bg-accent"
                                    onClick={() => handleTipoSelect(tipo.id)}
                                >
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">
                                            Tipo {tipo.id}: {tipo.titulo}
                                        </CardTitle>
                                        <CardDescription>{tipo.descripcion}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {tipo.requiereCodigoR
                                                    ? 'Requiere código de generación de reemplazo'
                                                    : 'No requiere código de reemplazo'}
                                            </span>
                                            <Button variant="outline" size="sm">
                                                Seleccionar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'form' && tipoSeleccionado && (
                    <div className="py-4">
                        <div className="mb-4">
                            <Button variant="outline" onClick={handleBack} className="mb-4 bg-transparent">
                                ← Volver a selección de tipo
                            </Button>
                        </div>

                        <AnulacionForm venta={venta} tipoAnulacion={tipoSeleccionado} onSuccess={handleClose} onCancel={handleClose} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
