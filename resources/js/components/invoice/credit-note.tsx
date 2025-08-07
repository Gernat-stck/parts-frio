import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DEPARTAMENTS, MUNICIPALITIES_BY_DEPARTMENT } from '@/constants/salesConstants';
import { buildCreditNotePayload, convertToFormData, generateInvoiceData } from '@/helpers/generadores';
import { CreditNotePayload } from '@/types/invoice';
import { CheckCircle, Eye, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Apendice, BodyDocument, InvoicePayload } from '../../types/invoice';
import EconomicActivitySearch from '../client/economic-activity-search';
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
import CreditNotePreview from './credit-note-preview';

interface CreditNoteTabsProps {
    invoice: InvoicePayload;
}

export default function CreditNoteTabs({ invoice }: CreditNoteTabsProps) {
    const [formData, setFormData] = useState<CreditNotePayload | null>(null);
    const [activeTab, setActiveTab] = useState('related');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openPreview, setOpenPreview] = useState(false); // Nuevo estado para el Dialog
    const selectedDepartment = formData?.receptor.direccion.departamento;
    const filteredMunicipios = selectedDepartment ? (MUNICIPALITIES_BY_DEPARTMENT[selectedDepartment] ?? []) : [];

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
                resumen: invoice.resumen
            });
            setFormData(initialFormData);
        }
    }, [invoice]);

    const handleInputChange = (path: string, value: any) => {
        setFormData((prevData) => {
            if (!prevData) return null;
            const keys = path.split('.');
            const newData = { ...prevData };
            let current: any = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });

        // Clear error when user starts typing
        if (errors[path]) {
            setErrors((prev) => ({ ...prev, [path]: '' }));
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = [...prev.cuerpoDocumento];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            return { ...prev, cuerpoDocumento: updatedItems };
        });
    };

    const handleAddItem = () => {
        setFormData((prev) => {
            if (!prev) return prev;
            const newNumItem = prev.cuerpoDocumento.length > 0 ? Math.max(...prev.cuerpoDocumento.map((item) => item.numItem)) + 1 : 1;

            const newItem: BodyDocument = {
                numItem: newNumItem,
                tipoItem: 1,
                numeroDocumento: prev.identificacion.numeroControl as unknown as null,
                cantidad: 1,
                codigo: null as unknown as string, // Corregido: `codigo` puede ser `null` en la interfaz `BodyDocument`.
                codTributo: null,
                uniMedida: 1,
                descripcion: '',
                precioUni: 0,
                montoDescu: 0,
                ventaNoSuj: 0,
                ventaExenta: 0,
                ventaGravada: 0,
                tributos: null,
                psv: 0,
                noGravado: 0,
            };

            return {
                ...prev,
                cuerpoDocumento: [...prev.cuerpoDocumento, newItem],
            };
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

    const handleAddApendice = () => {
        setFormData((prev) => {
            if (!prev) return prev;
            const newApendice: Apendice = { campo: '', etiqueta: '', valor: '' };
            return {
                ...prev,
                apendice: [...(prev.apendice || []), newApendice],
            };
        });
    };

    const handleRemoveApendice = (index: number) => {
        setFormData((prev) => {
            if (!prev || !prev.apendice) return prev;
            return {
                ...prev,
                apendice: prev.apendice.filter((_, i) => i !== index),
            };
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData) return false;

        // Validate required fields
        if (!formData.receptor.nombre.trim()) {
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

        if (formData.cuerpoDocumento.length === 0) {
            newErrors['cuerpoDocumento'] = 'Debe agregar al menos un ítem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !validateForm()) {
            return;
        }

        try {
            // Formatear los datos actualizados antes de enviar
           const formattedData = buildCreditNotePayload(formData);


            const formDataToSend = convertToFormData(formattedData);
            console.log('Datos de la Nota de Crédito:', formattedData);
            console.log('FormData para envío:', formDataToSend);
            return;
            // Here you would send the data to your API
            // await submitCreditNote(formDataToSend);

            alert('Nota de crédito generada exitosamente');
        } catch (error) {
            console.error('Error al generar la nota de crédito:', error);
            alert('Error al generar la nota de crédito');
        }
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

    return (
        <div className="mx-auto w-full max-w-7xl space-y-2 p-2">
            <Card className="border-none shadow-lg">
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

                            {/* Dialog Trigger */}
                            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                        <Eye className="mr-1 h-4 w-4" />
                                        Vista Previa
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Vista Previa de la Nota de Crédito</DialogTitle>
                                    </DialogHeader>
                                    {formData && <CreditNotePreview formData={formData} />}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="m-0 p-0">
                    <div className="grid grid-cols-1">
                        {/* Form Section */}
                        <div className="px-6 pb-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="lg:grid-cols-auto grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
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
                                        <ScrollArea className="h-[45vh]">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-2 sm:col-span-2">
                                                    <Label htmlFor="receptor.nombre">Nombre del Receptor *</Label>
                                                    <Input
                                                        id="receptor.nombre"
                                                        value={formData.receptor.nombre}
                                                        onChange={(e) => handleInputChange('receptor.nombre', e.target.value)}
                                                        className={errors['receptor.nombre'] ? 'border-red-500' : ''}
                                                    />
                                                    {errors['receptor.nombre'] && <p className="text-sm text-red-500">{errors['receptor.nombre']}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>NIT *</Label>
                                                    <Input
                                                        value={formData.receptor.nit || ''}
                                                        onChange={(e) => handleInputChange('receptor.nit', e.target.value)}
                                                        placeholder="1234567890123"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>NRC</Label>
                                                    <Input
                                                        value={formData.receptor.nrc || ''}
                                                        onChange={(e) => handleInputChange('receptor.nrc', e.target.value)}
                                                        placeholder="12345678"
                                                    />
                                                </div>
                                                <div className="space-y-2 sm:col-span-2">
                                                    <EconomicActivitySearch
                                                        codActividad={formData.receptor.codActividad}
                                                        descActividad={formData.receptor.descActividad}
                                                        onSelect={(value, label) => {
                                                            handleInputChange('receptor.codActividad', value);
                                                            handleInputChange('receptor.descActividad', label);
                                                        }}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Departamento *</Label>
                                                    <Select
                                                        value={formData.receptor.direccion.departamento}
                                                        onValueChange={(value) => {
                                                            handleInputChange('receptor.direccion.departamento', value);
                                                            handleInputChange('receptor.direccion.municipio', '');
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar departamento" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {DEPARTAMENTS.map((dept) => (
                                                                <SelectItem key={dept.value} value={dept.value}>
                                                                    <span className="hidden sm:inline">{dept.value} - </span>
                                                                    {dept.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors['receptor.direccion.departamento'] && (
                                                        <p className="text-sm text-red-500">{errors['receptor.direccion.departamento']}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Municipio *</Label>
                                                    <Select
                                                        value={formData.receptor.direccion.municipio}
                                                        onValueChange={(value) => handleInputChange('receptor.direccion.municipio', value)}
                                                        disabled={!selectedDepartment}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar municipio" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {filteredMunicipios.map((mun) => (
                                                                <SelectItem key={mun.value} value={mun.value}>
                                                                    <span className="hidden sm:inline">{mun.value} - </span>
                                                                    {mun.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors['receptor.direccion.municipio'] && (
                                                        <p className="text-sm text-red-500">{errors['receptor.direccion.municipio']}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2 sm:col-span-2">
                                                    <Label>Dirección Completa *</Label>
                                                    <Textarea
                                                        value={formData.receptor.direccion.complemento}
                                                        onChange={(e) => handleInputChange('receptor.direccion.complemento', e.target.value)}
                                                        placeholder="Dirección completa (calle, colonia, casa, etc.)"
                                                        className={errors['receptor.direccion.complemento'] ? 'border-red-500' : ''}
                                                        rows={2}
                                                    />
                                                    {errors['receptor.direccion.complemento'] && (
                                                        <p className="text-sm text-red-500">{errors['receptor.direccion.complemento']}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Teléfono</Label>
                                                    <Input
                                                        value={formData.receptor.telefono || ''}
                                                        onChange={(e) => handleInputChange('receptor.telefono', e.target.value)}
                                                        placeholder="2234-5678"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Correo Electrónico *</Label>
                                                    <Input
                                                        type="email"
                                                        value={formData.receptor.correo}
                                                        onChange={(e) => handleInputChange('receptor.correo', e.target.value)}
                                                        placeholder="correo@ejemplo.com"
                                                    />
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Items Tab */}
                                    <TabsContent value="items" className="mt-3 space-y-2">
                                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <h3 className="text-lg font-semibold">Ítems del Documento</h3>
                                            <Button onClick={handleAddItem} size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Agregar Ítem
                                            </Button>
                                        </div>

                                        {errors['cuerpoDocumento'] && <p className="mb-4 text-sm text-red-500">{errors['cuerpoDocumento']}</p>}

                                        <ScrollArea className="h-[40vh]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[50px]">#</TableHead>
                                                        <TableHead className="min-w-[200px]">Descripción</TableHead>
                                                        <TableHead className="w-[100px]">Cantidad</TableHead>
                                                        <TableHead className="w-[120px]">Precio Unit.</TableHead>
                                                        <TableHead className="w-[120px]">Descuento</TableHead>
                                                        <TableHead className="w-[120px]">Venta Gravada</TableHead>
                                                        <TableHead className="w-[80px]">Acciones</TableHead>
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
                                                    {formData.cuerpoDocumento.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{item.numItem}</TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    value={item.descripcion || ''}
                                                                    onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                                                                    placeholder="Descripción del ítem"
                                                                    className="min-w-[200px]"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    step="0.00000001"
                                                                    value={item.cantidad}
                                                                    onChange={(e) =>
                                                                        handleItemChange(index, 'cantidad', parseFloat(e.target.value) || 0)
                                                                    }
                                                                    placeholder="0"
                                                                    className="w-[100px]"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    step="0.00000001"
                                                                    value={item.precioUni}
                                                                    onChange={(e) =>
                                                                        handleItemChange(index, 'precioUni', parseFloat(e.target.value) || 0)
                                                                    }
                                                                    placeholder="0.00"
                                                                    className="w-[120px]"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    step="0.00000001"
                                                                    value={item.montoDescu}
                                                                    onChange={(e) =>
                                                                        handleItemChange(index, 'montoDescu', parseFloat(e.target.value) || 0)
                                                                    }
                                                                    placeholder="0.00"
                                                                    className="w-[120px]"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    step="0.00000001"
                                                                    value={item.ventaGravada}
                                                                    onChange={(e) =>
                                                                        handleItemChange(index, 'ventaGravada', parseFloat(e.target.value) || 0)
                                                                    }
                                                                    placeholder="0.00"
                                                                    className="w-[120px]"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    aria-label={`Eliminar ítem ${item.numItem}`}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Summary Tab */}
                                    <TabsContent value="summary" className="mt-3 space-y-2">
                                        <ScrollArea className="h-[45vh]">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label>Total No Sujetas</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.totalNoSuj}
                                                        onChange={(e) => handleInputChange('resumen.totalNoSuj', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Total Exentas</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.totalExenta}
                                                        onChange={(e) => handleInputChange('resumen.totalExenta', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Total Gravadas</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.totalGravada}
                                                        onChange={(e) => handleInputChange('resumen.totalGravada', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Sub Total Ventas</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.subTotalVentas}
                                                        onChange={(e) => handleInputChange('resumen.subTotalVentas', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Total Descuentos</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.totalDescu}
                                                        onChange={(e) => handleInputChange('resumen.totalDescu', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Sub Total</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.subTotal}
                                                        onChange={(e) => handleInputChange('resumen.subTotal', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>IVA Percibido</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.ivaPerci1 || 0}
                                                        onChange={(e) => handleInputChange('resumen.ivaPerci1', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>IVA Retenido</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.ivaRete1 || 0}
                                                        onChange={(e) => handleInputChange('resumen.ivaRete1', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Retención Renta</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.reteRenta || 0}
                                                        onChange={(e) => handleInputChange('resumen.reteRenta', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                                    <Label>Monto Total de la Operación</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.resumen.montoTotalOperacion}
                                                        onChange={(e) =>
                                                            handleInputChange('resumen.montoTotalOperacion', parseFloat(e.target.value) || 0)
                                                        }
                                                        className="text-lg font-semibold"
                                                    />
                                                </div>
                                                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                                    <Label>Total en Letras</Label>
                                                    <Textarea
                                                        value={formData.resumen.totalLetras}
                                                        onChange={(e) => handleInputChange('resumen.totalLetras', e.target.value)}
                                                        placeholder="Cantidad en letras"
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Condición de Operación</Label>
                                                    <Select
                                                        value={formData.resumen.condicionOperacion.toString()}
                                                        onValueChange={(value) => handleInputChange('resumen.condicionOperacion', parseInt(value))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Contado</SelectItem>
                                                            <SelectItem value="2">Crédito</SelectItem>
                                                            <SelectItem value="3">Otro</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row">
                                    <Button type="submit" className="flex-1 sm:flex-none">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Generar Nota de Crédito
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setOpenPreview(true)} className="flex-1 sm:flex-none">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Mostrar Vista Previa
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
