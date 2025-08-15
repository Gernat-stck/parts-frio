import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AnulacionData, Factura } from '@/types/invoice';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { generarCodigoGeneracion, generateAnulacionPayload } from '../../helpers/generadores';

interface AnulacionFormProps {
    venta: Factura;
    tipoAnulacion: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AnulacionForm({ venta, tipoAnulacion, onSuccess, onCancel }: AnulacionFormProps) {
    const [loading, setLoading] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState<AnulacionData>({
        // Datos del documento
        codigoGeneracionR: tipoAnulacion === 2 ? '' : generarCodigoGeneracion(),
        montoIva: Number(venta.detallesFactura.iva.toFixed(2)),

        // Datos del receptor (simulados desde DB)
        tipoDocumento: venta.tipoDocumento ?? (venta.numDocumento ? '36' : null),
        numDocumento: venta.numDocumento ?? null,
        nombre: venta.receptor ?? null,
        telefono: venta.telefono ?? null,
        correo: venta.correo ?? null,

        // Motivo de anulación
        motivoAnulacion: '',
        nombreResponsable: '',
        tipoDocResponsable: '13',
        numDocResponsable: '',
        nombreSolicita: '',
        tipoDocSolicita: '13',
        numDocSolicita: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const generateAnulacionPayloadData = () => {
        return generateAnulacionPayload({
            invoice: venta,
            formData,
            tipoAnulacion,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = generateAnulacionPayloadData();

            // Aquí iría la llamada a la API
            console.log('Payload de anulación:', JSON.stringify(payload, null, 2));

            // Simular llamada a API
            await axios.post(route('admin.save.invoice', { tipoDte: 'anulacion' }), {
                invoiceData: payload,
            });

            toast.success('El evento de invalidación ha sido generado exitosamente');

            onSuccess();
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Error al generar la anulación';
                toast.error(errorMessage);
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del documento */}
            <Card>
                <CardHeader>
                    <CardTitle>Información del Documento</CardTitle>
                    <CardDescription>Datos del DTE a anular</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Código de Generación Original</Label>
                            <Input value={venta.codigoGeneracion ?? ''} disabled className="font-mono" />
                        </div>
                        <div>
                            <Label>Número de Control</Label>
                            <Input value={venta.numeroControl} disabled className="font-mono" />
                        </div>
                    </div>

                    {tipoAnulacion !== 2 && (
                        <div>
                            <Label htmlFor="codigoGeneracionR">Código de Generación de Reemplazo *</Label>
                            <Input
                                id="codigoGeneracionR"
                                value={formData.codigoGeneracionR}
                                onChange={(e) => handleInputChange('codigoGeneracionR', e.target.value)}
                                className="font-mono"
                                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="montoIva">Monto IVA</Label>
                        <Input
                            id="montoIva"
                            type="number"
                            step="0.01"
                            value={formData.montoIva}
                            onChange={(e) => handleInputChange('montoIva', e.target.value)}
                            required
                            disabled
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Datos del receptor */}
            <Card>
                <CardHeader>
                    <CardTitle>Datos del Receptor</CardTitle>
                    <CardDescription>Información del cliente (obtenida de la base de datos)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                            <Input
                                value={formData.tipoDocumento || 'No se proporcionó'}
                                onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                                disabled
                            />
                        </div>
                        <div>
                            <Label htmlFor="numDocumento">Número de Documento</Label>
                            <Input
                                id="numDocumento"
                                value={formData.numDocumento || 'No se proporcionó'}
                                onChange={(e) => handleInputChange('numDocumento', e.target.value)}
                                required
                                disabled
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                            id="nombre"
                            value={formData.nombre || 'No se proporcionó'}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            required
                            disabled
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                value={formData.telefono || 'No se proporcionó'}
                                onChange={(e) => handleInputChange('telefono', e.target.value)}
                                disabled
                            />
                        </div>
                        <div>
                            <Label htmlFor="correo">Correo Electrónico</Label>
                            <Input
                                id="correo"
                                type="email"
                                value={formData.correo || 'No se proporcionó'}
                                onChange={(e) => handleInputChange('correo', e.target.value)}
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Motivo de anulación */}
            <Card>
                <CardHeader>
                    <CardTitle>Motivo de Anulación</CardTitle>
                    <CardDescription>Información sobre la anulación y responsables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="motivoAnulacion">Motivo de Anulación *</Label>
                        <Textarea
                            id="motivoAnulacion"
                            value={formData.motivoAnulacion}
                            onChange={(e) => handleInputChange('motivoAnulacion', e.target.value)}
                            placeholder="Describa el motivo de la anulación..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Responsable de la Anulación</h4>
                            <div>
                                <Label htmlFor="nombreResponsable">Nombre Completo *</Label>
                                <Input
                                    id="nombreResponsable"
                                    value={formData.nombreResponsable || ''}
                                    onChange={(e) => handleInputChange('nombreResponsable', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="tipDocResponsable">Tipo Doc.</Label>
                                    <Select
                                        value={formData.tipoDocResponsable}
                                        onValueChange={(value) => handleInputChange('tipDocResponsable', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="13">DUI</SelectItem>
                                            <SelectItem value="02">NIT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="numDocResponsable">Número *</Label>
                                    <Input
                                        id="numDocResponsable"
                                        value={formData.numDocResponsable}
                                        onChange={(e) => handleInputChange('numDocResponsable', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Quien Solicita la Anulación</h4>
                            <div>
                                <Label htmlFor="nombreSolicita">Nombre Completo *</Label>
                                <Input
                                    id="nombreSolicita"
                                    value={formData.nombreSolicita}
                                    onChange={(e) => handleInputChange('nombreSolicita', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="tipDocSolicita">Tipo Doc.</Label>
                                    <Select value={formData.tipoDocSolicita} onValueChange={(value) => handleInputChange('tipDocSolicita', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="13">DUI</SelectItem>
                                            <SelectItem value="02">NIT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="numDocSolicita">Número *</Label>
                                    <Input
                                        id="numDocSolicita"
                                        value={formData.numDocSolicita}
                                        onChange={(e) => handleInputChange('numDocSolicita', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Procesando...' : 'Generar Anulación'}
                </Button>
            </div>
        </form>
    );
}
