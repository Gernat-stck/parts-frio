import { buildCreditNotePayload, convertirNumeroALetras, convertToFormData, generateInvoiceData } from '@/helpers/generadores';
import { BodyDocument, CreditNotePayload, InvoicePayload } from '@/types/invoice';
import { router } from '@inertiajs/react';
import { CheckCircle, Eye, Minus, Trash2, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { calculateResumeTotals } from '../../hooks/use-invoice';
import ClientFormStep from '../client/client-form';
import LoaderCute from '../loader/loader-page';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import ElectronicInvoicePreview from './dte-preview';
import { TributosDialog } from './tributos-dialog';

interface CreditNoteTabsProps {
    invoice: InvoicePayload;
}

export default function CreditNoteTabs({ invoice }: CreditNoteTabsProps) {
    const [formData, setFormData] = useState<CreditNotePayload | null>(null);
    const [activeTab, setActiveTab] = useState('related');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isTributosModalOpen, setIsTributosModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (invoice) {
            const initialFormData = generateInvoiceData({
                cartItems: [],
                cuerpoDocumento: invoice.cuerpoDocumento,
                customerData: invoice.receptor,
                paymentData: invoice.resumen.pagos
                    ? { condicionOperacion: invoice.resumen.condicionOperacion, pagos: invoice.resumen.pagos }
                    : { condicionOperacion: 1, pagos: [] },
                dteType: '05',
                documentoRelacionado: [
                    {
                        tipoDocumento: invoice.identificacion.tipoDte,
                        tipoGeneracion: 2,
                        numeroDocumento: invoice.identificacion.codigoGeneracion,
                        fechaEmision: invoice.identificacion.fecEmi,
                    },
                ],
                ventaTercero: invoice.ventaTercero || null,
                resumen: invoice.resumen,
            });
            setFormData(initialFormData);
        }
    }, [invoice]);
    //Se esta utilizando en Receptor y Resumen

    const handleInputChange = (path: string, value: unknown) => {
        setFormData((prevData) => {
            if (!prevData) return null;
            const keys = path.split('.');
            const newData = { ...prevData };
            let current: unknown = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                // Asegura que current es un objeto antes de indexar
                if (typeof current === 'object' && current !== null) {
                    const currObj = current as Record<string, unknown>;
                    if (!currObj[keys[i]]) currObj[keys[i]] = {};
                    current = currObj[keys[i]];
                } else {
                    // Si current no es objeto, inicialízalo como objeto
                    current = {};
                }
            }
            // Última asignación
            if (typeof current === 'object' && current !== null) {
                (current as Record<string, unknown>)[keys[keys.length - 1]] = value;
            }
            return newData;
        });

        // Clear error when user starts typing
        if (errors[path]) {
            setErrors((prev) => ({ ...prev, [path]: '' }));
        }
    };

    //Se utiliza unicamente en Items
    const handleItemChange = (index: number, field: keyof BodyDocument, value: unknown) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = [...prev.cuerpoDocumento];
            const currentItem = updatedItems[index];

            // Se crea el objeto actualizado, pero sin cambiar el precioUni ya que es fijo
            const updatedItem = { ...currentItem, [field]: value };

            // Recalcular los valores solo si los campos "cantidad" o "montoDescu" cambian
            if (['cantidad', 'montoDescu'].includes(field as string)) {
                const cantidad = parseFloat(updatedItem.cantidad as unknown as string) || 0;
                const precioSinIva = parseFloat(currentItem.precioUni as unknown as string) || 0;

                // 1. Calcular el subtotal (Monto Base) antes de descuento
                const subtotalSinIva = cantidad * precioSinIva;

                let montoDescuMonetario = 0;

                // 2. Si el campo modificado es 'montoDescu', el valor es el porcentaje
                if (field === 'montoDescu') {
                    const porcentaje = parseFloat(value as string) || 0;

                    // Asegurar que el porcentaje no sea negativo y no exceda el 100%
                    const finalPorcentaje = Math.max(0, Math.min(100, porcentaje));
                    montoDescuMonetario = subtotalSinIva * (finalPorcentaje / 100);
                } else {
                    // Si cambia la cantidad
                    // 3. Recalcular el monto del descuento para mantener el porcentaje constante
                    const porcentajeActual =
                        subtotalSinIva > 0 ? ((currentItem.montoDescu || 0) / (currentItem.cantidad * precioSinIva || 1)) * 100 : 0;
                    const finalPorcentaje = Math.max(0, Math.min(100, porcentajeActual));
                    montoDescuMonetario = subtotalSinIva * (finalPorcentaje / 100);
                }

                // 4. Actualizar el monto del descuento monetario en el ítem
                updatedItem.montoDescu = parseFloat(montoDescuMonetario.toFixed(2));

                // 5. Calcular el valor de la venta gravada después de aplicar el descuento
                const ventaGravadaCalculada = subtotalSinIva - updatedItem.montoDescu;

                // 6. Limitar el valor de ventaGravada a dos decimales y actualizarlo
                updatedItem.ventaGravada = parseFloat(ventaGravadaCalculada.toFixed(2));
            }

            updatedItems[index] = updatedItem;
            return { ...prev, cuerpoDocumento: updatedItems };
        });
    };
    const handleRemoveItem = (indexToRemove: number) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = prev.cuerpoDocumento
                .filter((_, index) => index !== indexToRemove)
                .map((item, idx) => ({ ...item, numItem: idx + 1 }));

            return { ...prev, cuerpoDocumento: updatedItems };
        });
    };
    useEffect(() => {
        // Asegurarse de que formData y cuerpoDocumento existan
        if (formData && formData.cuerpoDocumento) {
            // 1. Llamar a la función de cálculo del helper
            const calculatedTotals = calculateResumeTotals(formData.cuerpoDocumento);
            // 2. Calcular el total en letras usando la nueva función
            const totalEnLetras = convertirNumeroALetras(calculatedTotals.total);

            // 3. Actualizar el estado del formulario con los nuevos totales
            setFormData((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    resumen: {
                        ...prev.resumen,
                        ...calculatedTotals,
                        totalLetras: totalEnLetras,
                    },
                };
            });
        }
    }, [formData?.cuerpoDocumento]);
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData) return false;

        // Validate required fields
        if (!formData?.receptor?.nombre?.trim()) {
            newErrors['receptor.nombre'] = 'El nombre del receptor es requerido';
        }

        if (!formData.receptor.direccion.departamento) {
            newErrors['receptor.direccion.departamento'] = 'El departamento es requerido';
        }

        if (!formData.receptor.direccion.municipio) {
            newErrors['receptor.direccion.municipio'] = 'El municipio es requerido';
        }

        if (!formData.receptor.direccion.complemento.trim()) {
            newErrors['receptor.direccion.complemento'] = 'La dirección completa es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const formattedData = buildCreditNotePayload(formData);
            const formDataToSend = convertToFormData(formattedData);
            router.post(route('admin.save.invoice', { tipoDte: '05' }), formDataToSend, {
                preserveScroll: true,
                preserveState: true,
            });
        } catch (error) {
            console.error('Error al generar la nota de crédito:', error);
            alert('Error al generar la nota de crédito');
        } finally {
            setIsLoading(false);
        }
    };
    const handleOpenTributosModal = (index: number) => {
        setSelectedItemIndex(index);
        setIsTributosModalOpen(true);
    };
    const handleCloseTributosModal = () => {
        setSelectedItemIndex(null);
        setIsTributosModalOpen(false);
    };
    const handleAddTributo = (tributoValue: string) => {
        if (selectedItemIndex === null) return;

        setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = [...prev.cuerpoDocumento];
            const currentItem = updatedItems[selectedItemIndex];

            // Aseguramos que currentItem.tributos sea un array antes de usar 'includes'
            const currentTributos = currentItem.tributos ?? [];

            // Aseguramos que el tipo sea string[] antes de usar 'includes'
            const validTributos = currentTributos.filter((t): t is string => typeof t === 'string');

            if (!validTributos.includes(tributoValue)) {
                // Usamos un array vacío como fallback si el array de tributos es null o undefined
                currentItem.tributos = [...validTributos, tributoValue];
            }

            return { ...prev, cuerpoDocumento: updatedItems };
        });
    };
    //Handler para remover tributo
    const handleRemoveTributo = (tributoValue: string) => {
        if (selectedItemIndex === null) return;

        setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = [...prev.cuerpoDocumento];
            const currentItem = updatedItems[selectedItemIndex];

            // Se usa (currentItem.tributos || []) para asegurar que siempre sea un array.
            // El tipo resultante sigue siendo Array<unknown>, que es compatible con el tipo de tributos.
            currentItem.tributos = (currentItem.tributos || []).filter((t) => t !== tributoValue);

            return { ...prev, cuerpoDocumento: updatedItems };
        });
    };
    if (!formData) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Cargando datos de la factura...</p>
                </div>
            </div>
        );
    }
    if (isLoading) {
        return <LoaderCute description="Estamos validando informacion con hacienda, espera un momento." />;
    }
    return (
        <div className="mx-auto w-full max-w-7xl space-y-2">
            <Card className="border-none shadow-none">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl">Nota de Crédito Electrónica</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Genere una nota de crédito basada en la factura seleccionada
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-cyan-200/10 text-xs sm:text-sm">
                                {formData.identificacion.numeroControl}
                            </Badge>

                            <Button variant="outline" size="sm" onClick={() => setActiveTab('preview')} className="text-xs sm:text-sm">
                                <Eye className="mr-1 h-4 w-4" />
                                Vista Previa
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="m-0 border-0 p-0 shadow-none">
                    <div className="grid grid-cols-1">
                        {/* Form Section */}
                        <div className="px-6 pb-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="lg:grid-cols-auto grid h-11 w-full grid-cols-2 gap-1 p-1 sm:grid-cols-5">
                                        <TabsTrigger value="related" className="px-2 py-2 text-xs sm:text-sm">
                                            Doc. Relacionado
                                        </TabsTrigger>
                                        <TabsTrigger value="receptor" className="px-2 py-2 text-xs sm:text-sm">
                                            Receptor
                                        </TabsTrigger>
                                        <TabsTrigger value="items" className="px-2 py-2 text-xs sm:text-sm">
                                            Ítems
                                        </TabsTrigger>
                                        <TabsTrigger value="summary" className="px-2 py-2 text-xs sm:text-sm">
                                            Resumen
                                        </TabsTrigger>
                                        <TabsTrigger value="preview" className="px-2 py-2 text-xs sm:text-sm">
                                            Preview
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Related Document Tab */}
                                    <TabsContent value="related" className="mt-6 space-y-4">
                                        <div className="space-y-4">
                                            <Card className="p-4">
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {formData?.documentoRelacionado?.map((doc, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <div className="space-y-2">
                                                                <Label>Tipo de Documento *</Label>
                                                                <Input
                                                                    value={`${doc.tipoDocumento} - Credito Fiscal`}
                                                                    onChange={(e) =>
                                                                        handleInputChange(`documentoRelacionado.${idx}.tipoDocumento`, e.target.value)
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Tipo de Generación *</Label>
                                                                <Select
                                                                    value={doc.tipoGeneracion?.toString() ?? ''}
                                                                    onValueChange={(value) =>
                                                                        handleInputChange(
                                                                            `documentoRelacionado.${idx}.tipoGeneracion`,
                                                                            parseInt(value),
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="1">Físico</SelectItem>
                                                                        <SelectItem value="2">Electrónico</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Número de Documento *</Label>
                                                                <Input
                                                                    value={doc.numeroDocumento ?? ''}
                                                                    onChange={(e) =>
                                                                        handleInputChange(
                                                                            `documentoRelacionado.${idx}.numeroDocumento`,
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                    className="font-mono text-xs sm:text-sm"
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Fecha de Emisión *</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={doc.fechaEmision ?? ''}
                                                                    onChange={(e) =>
                                                                        handleInputChange(`documentoRelacionado.${idx}.fechaEmision`, e.target.value)
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Receptor Tab */}
                                    <TabsContent value="receptor" className="mt-3 space-y-4">
                                        {formData && (
                                            <ClientFormStep
                                                data={formData.receptor}
                                                documentType={'05'}
                                                setData={(updatedReceptor) => {
                                                    setFormData((prevData) => {
                                                        if (!prevData) return null;
                                                        return {
                                                            ...prevData,
                                                            receptor: updatedReceptor,
                                                        };
                                                    });
                                                }}
                                            />
                                        )}
                                    </TabsContent>

                                    {/* Items Tab */}
                                    <TabsContent value="items" className="mt-3 space-y-2">
                                        {errors['cuerpoDocumento'] && <p className="mb-4 text-sm text-red-500">{errors['cuerpoDocumento']}</p>}

                                        <ScrollArea className="h-[40vh]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-8">#</TableHead>
                                                        <TableHead className="min-w-48">Descripción</TableHead>
                                                        <TableHead className="w-[100px]">Cantidad</TableHead>
                                                        <TableHead className="w-[90px] truncate overflow-hidden text-right">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="text-sm font-medium whitespace-nowrap">Precio sin IVA</span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <span>Precio sin IVA</span>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TableHead>
                                                        <TableHead className="w-[100px]">Descuento (%)</TableHead>{' '}
                                                        {/* Encabezado de descuento modificado */}
                                                        <TableHead className="w-[120px] text-right">Venta Gravada</TableHead>
                                                        <TableHead className="w-20 text-right">Acciones</TableHead> {/* Espacio para dos íconos */}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {formData.cuerpoDocumento.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                                No hay ítems en el documento. Haga clic en "Agregar Ítem" para comenzar.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {formData.cuerpoDocumento.map((item, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell className="font-medium">{item.numItem}</TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        value={item.descripcion || ''}
                                                                        onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                                                                        placeholder="Descripción del ítem"
                                                                        className="min-w-[200px]"
                                                                        disabled
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="size-6 p-1"
                                                                            onClick={() =>
                                                                                handleItemChange(index, 'cantidad', Math.max(1, item.cantidad - 1))
                                                                            }
                                                                            disabled={item.cantidad <= 1}
                                                                        >
                                                                            <Minus className="h-4 w-4" />
                                                                        </Button>
                                                                        <Input
                                                                            type="number"
                                                                            step="1"
                                                                            min="1"
                                                                            value={item.cantidad}
                                                                            onChange={(e) =>
                                                                                handleItemChange(index, 'cantidad', parseFloat(e.target.value) || 0)
                                                                            }
                                                                            placeholder="0"
                                                                            className="w-[50px] [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.precioUni} // Mostrar el precio sin IVA
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'precioUni', parseFloat(e.target.value) || 0)
                                                                        }
                                                                        placeholder="0.00"
                                                                        className="w-[90px] text-right"
                                                                        disabled
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="flex w-fit items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        step="1"
                                                                        min="0"
                                                                        value={
                                                                            // Muestra el porcentaje calculado a partir del monto monetario
                                                                            ((item.montoDescu / (item.precioUni * item.cantidad || 1)) * 100).toFixed(
                                                                                0,
                                                                            )
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleItemChange(
                                                                                index,
                                                                                'montoDescu',
                                                                                // Pasa el porcentaje (valor del input) al handler
                                                                                parseFloat(e.target.value).toFixed(2) || 0,
                                                                            )
                                                                        }
                                                                        placeholder="0"
                                                                        className="w-[80px] [appearance:textfield] text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                    />
                                                                    <span>% ({item.montoDescu.toFixed(2) || 0})</span>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.ventaGravada}
                                                                        onChange={(e) =>
                                                                            handleItemChange(
                                                                                index,
                                                                                'ventaGravada',
                                                                                parseFloat(e.target.value).toFixed(2) || 0,
                                                                            )
                                                                        }
                                                                        placeholder="0.00"
                                                                        className="w-[120px] text-right"
                                                                        disabled
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="w-20 space-x-2 text-right">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                type="button"
                                                                                onClick={() => handleOpenTributosModal(index)}
                                                                                aria-label={`Ver y agregar tributos para el ítem ${item.numItem}`}
                                                                            >
                                                                                <Zap className="h-4 w-4 text-blue-500" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <span>Ver/Editar Tributos</span>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        type="button"
                                                                        onClick={() => handleRemoveItem(index)}
                                                                        aria-label={`Eliminar ítem ${item.numItem}`}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Summary Tab */}
                                    <TabsContent value="summary" className="mt-3 space-y-2">
                                        <ScrollArea className="h-[45vh]">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {formData.resumen &&
                                                    Object.entries(formData.resumen)
                                                        .filter(([key]) =>
                                                            ['totalGravada', 'subTotalVentas', 'totalIva', 'totalDescu', 'total'].includes(key),
                                                        )
                                                        .map(([key, value]) => (
                                                            <div className="space-y-2" key={key}>
                                                                <Label>{key}</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={typeof value === 'number' ? value.toFixed(2) : value}
                                                                    onChange={(e) =>
                                                                        handleInputChange(`resumen.${key}`, parseFloat(e.target.value) || 0)
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        ))}
                                                {'totalLetras' in formData.resumen && (
                                                    <div className="col-span-1 space-y-2 sm:col-span-2 lg:col-span-3" key="totalenLetras">
                                                        <Label>Total en Letras</Label>
                                                        <Textarea
                                                            value={formData.resumen.totalLetras}
                                                            onChange={(e) => handleInputChange('resumen.totalenLetras', e.target.value)}
                                                            rows={3}
                                                            disabled
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>

                                    <TabsContent value="preview" className="mt-3 space-y-2">
                                        <ScrollArea className="h-[46vh]">
                                            {/* Aqui se mostrara el preview */}
                                            <ElectronicInvoicePreview />
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row">
                                    <Button type="submit" className="flex-1 sm:flex-none">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Generar Nota de Crédito
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('preview')} className="flex-1 sm:flex-none">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Mostrar Vista Previa
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <TributosDialog
                isOpen={isTributosModalOpen}
                onOpenChange={handleCloseTributosModal}
                item={selectedItemIndex !== null ? formData.cuerpoDocumento[selectedItemIndex] : null}
                onAddTributo={handleAddTributo}
                onRemoveTributo={handleRemoveTributo}
            />
        </div>
    );
}
