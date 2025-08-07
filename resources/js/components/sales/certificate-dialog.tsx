import type { Factura } from '@/types/invoice';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { CONTINGENCY_TYPES } from '../../constants/salesConstants';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface DialogCertificarFacturasProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    facturas: Factura[];
    seleccionadas: string[];
    onSeleccionar: (numeroControl: string, checked: boolean) => void;
    onConfirm: (data: {
        selectedFacturas: Factura[];
        contingencyType: string;
        justification: string;
        fInicio: string;
        fFin: string;
        hInicio: string;
        hFin: string;
    }) => void;
}

export function DialogCertificarFacturas({ open, onOpenChange, facturas, seleccionadas, onSeleccionar, onConfirm }: DialogCertificarFacturasProps) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const selectedFacturaObjects = facturas.filter((f) => seleccionadas.includes(f.numeroControl));

    const [currentStep, setCurrentStep] = useState(1);
    const [contingencyType, setContingencyType] = useState('');
    const [contingencyJustification, setContingencyJustification] = useState('');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [startTime, setStartTime] = useState('08:00'); // Usar HH:MM para input type="time"
    const [endTime, setEndTime] = useState('12:00');
    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleFinalConfirm = () => {
        onConfirm({
            selectedFacturas: selectedFacturaObjects,
            contingencyType,
            justification: contingencyJustification,
            fInicio: startDate,
            fFin: endDate,
            hInicio: startTime + ':00', // Añadir segundos para el formato deseado
            hFin: endTime + ':00', // Añadir segundos para el formato deseado
        });
        // Reset state and close dialog after confirmation
        setCurrentStep(1);
        setContingencyType('');
        setContingencyJustification('');
        setStartDate(today);
        setEndDate(today);
        setStartTime('08:00');
        setEndTime('12:00');
        onOpenChange(false);
    };

    const handleCancel = () => {
        setCurrentStep(1); // Reset step
        setContingencyType('');
        setContingencyJustification('');
        setStartDate(today);
        setEndDate(today);
        setStartTime('08:00');
        setEndTime('12:00');
        onOpenChange(false); // Close dialog
    };
    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {currentStep === 1 && 'Certificar Facturas en Contingencia'}
                        {currentStep === 2 && 'Detalles de Contingencia'}
                        {currentStep === 3 && 'Resumen de Certificación'}
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && 'Seleccione las facturas que desea certificar'}
                        {currentStep === 2 && 'Ingrese los detalles de la contingencia'}
                        {currentStep === 3 && 'Revise los detalles antes de confirmar'}
                    </DialogDescription>
                </DialogHeader>

                {currentStep === 1 && (
                    <>
                        <div className="max-h-96 space-y-4 overflow-y-auto">
                            {facturas.map((factura) => (
                                <div key={factura.id} className="flex items-center space-x-2 rounded border p-3">
                                    <Checkbox
                                        id={`factura-${factura.id}`}
                                        checked={seleccionadas.includes(factura.numeroControl)}
                                        onCheckedChange={(checked) => onSeleccionar(factura.numeroControl, checked === true)}
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">{factura.receptor}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {factura.fechaGeneracion} - ${factura.monto}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button onClick={handleNextStep} disabled={seleccionadas.length === 0}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Certificar Seleccionadas ({seleccionadas.length})
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">DTEs Seleccionados:</h3>
                            <div className="max-h-40 overflow-y-auto rounded border p-3">
                                {selectedFacturaObjects.length > 0 ? (
                                    selectedFacturaObjects.map((factura) => (
                                        <div key={factura.id} className="text-sm">
                                            - {factura.receptor} ({factura.numeroControl}) - ${factura.monto}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No hay DTEs seleccionados.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contingency-type">Tipo de Contingencia</Label>
                                <Select value={contingencyType} onValueChange={setContingencyType}>
                                    <SelectTrigger id="contingency-type">
                                        <SelectValue placeholder="Seleccione un tipo de contingencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONTINGENCY_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="justification">Justificación de la Contingencia</Label>
                                <Textarea
                                    id="justification"
                                    placeholder="Describa la razón de la contingencia"
                                    value={contingencyJustification}
                                    onChange={(e) => setContingencyJustification(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                                    <input
                                        id="start-date"
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date">Fecha de Fin</Label>
                                    <input
                                        id="end-date"
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start-time">Hora de Inicio</Label>
                                    <input
                                        id="start-time"
                                        type="time"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-time">Hora de Fin</Label>
                                    <input
                                        id="end-time"
                                        type="time"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handlePreviousStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                disabled={!contingencyType || !contingencyJustification.trim() || !startDate || !endDate || !startTime || !endTime}
                            >
                                Siguiente
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Resumen de Certificación:</h3>
                            <div className="space-y-2 rounded border p-4">
                                <div>
                                    <span className="font-medium">DTEs a Certificar ({selectedFacturaObjects.length}):</span>
                                    <ul className="list-disc pl-5 text-sm">
                                        {selectedFacturaObjects.length > 0 ? (
                                            selectedFacturaObjects.map((factura) => (
                                                <li key={factura.id}>
                                                    {factura.receptor} ({factura.numeroControl}) - ${factura.monto}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No hay DTEs seleccionados.</li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-medium">Tipo de Contingencia:</span>{' '}
                                    <span className="text-muted-foreground">{contingencyType || 'No seleccionado'}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Justificación:</span>{' '}
                                    <p className="break-words text-muted-foreground">{contingencyJustification || 'No proporcionada'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Período de Contingencia:</span>{' '}
                                    <span className="text-muted-foreground">
                                        {startDate} {startTime} - {endDate} {endTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button variant="outline" onClick={handlePreviousStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                            </Button>
                            <Button onClick={handleFinalConfirm}>
                                Confirmar Certificación
                                <CheckCircle className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
