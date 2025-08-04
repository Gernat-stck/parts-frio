'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerData {
    tipoDocumento: string;
    numDocumento: string;
    nombre: string;
    direccion: {
        departamento: string;
        municipio: string;
        complemento: string;
    };
    telefono: string;
    correo: string;
}

interface CustomerDataStepProps {
    data: CustomerData;
    setData: (data: CustomerData) => void;
    onNext: () => void;
    onPrev: () => void;
}

const departamentos = [
    { value: '01', label: 'Ahuachapán' },
    { value: '02', label: 'Santa Ana' },
    { value: '03', label: 'Sonsonate' },
    { value: '04', label: 'Chalatenango' },
    { value: '05', label: 'La Libertad' },
    { value: '06', label: 'San Salvador' },
    { value: '07', label: 'Cuscatlán' },
    { value: '08', label: 'La Paz' },
    { value: '09', label: 'Cabañas' },
    { value: '10', label: 'San Vicente' },
    { value: '11', label: 'Usulután' },
    { value: '12', label: 'San Miguel' },
    { value: '13', label: 'Morazán' },
    { value: '14', label: 'La Unión' },
];

const tiposDocumento = [
    { value: '13', label: 'DUI' },
    { value: '36', label: 'NIT' },
    { value: '02', label: 'Carnet de Residente' },
    { value: '03', label: 'Pasaporte' },
    { value: '37', label: 'Otro' },
];

export default function ClientFormStep({ data, setData, onNext, onPrev }: CustomerDataStepProps) {
    const updateData = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setData({
                ...data,
                [parent]: {
                    ...(data as any)[parent],
                    [child]: value,
                },
            });
        } else {
            setData({
                ...data,
                [field]: value,
            });
        }
    };

    const isFormValid = () => {
        return (
            data.tipoDocumento &&
            data.numDocumento &&
            data.nombre &&
            data.direccion.departamento &&
            data.direccion.municipio &&
            data.direccion.complemento &&
            data.telefono
        );
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-none border-0">
                <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                            <Select value={data.tipoDocumento} onValueChange={(value) => updateData('tipoDocumento', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposDocumento.map((tipo) => (
                                        <SelectItem key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numDocumento">Número de Documento *</Label>
                            <Input
                                id="numDocumento"
                                value={data.numDocumento}
                                onChange={(e) => updateData('numDocumento', e.target.value)}
                                placeholder={data.tipoDocumento === '13' ? '12345678-9' : 'Número de documento'}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => updateData('nombre', e.target.value)}
                            placeholder="Nombre completo del cliente"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dirección</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="departamento">Departamento *</Label>
                                <Select value={data.direccion.departamento} onValueChange={(value) => updateData('direccion.departamento', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar departamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departamentos.map((dept) => (
                                            <SelectItem key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="municipio">Municipio *</Label>
                                <Input
                                    id="municipio"
                                    value={data.direccion.municipio}
                                    onChange={(e) => updateData('direccion.municipio', e.target.value)}
                                    placeholder="Código del municipio (ej: 01)"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="complemento">Dirección Completa *</Label>
                            <Input
                                id="complemento"
                                value={data.direccion.complemento}
                                onChange={(e) => updateData('direccion.complemento', e.target.value)}
                                placeholder="Dirección completa (calle, colonia, casa, etc.)"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono *</Label>
                            <Input
                                id="telefono"
                                value={data.telefono}
                                onChange={(e) => updateData('telefono', e.target.value)}
                                placeholder="7123-4567"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correo">Correo Electrónico</Label>
                            <Input
                                id="correo"
                                type="email"
                                value={data.correo}
                                onChange={(e) => updateData('correo', e.target.value)}
                                placeholder="cliente@email.com"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrev}>
                    Volver al Carrito
                </Button>
                <Button onClick={onNext} disabled={!isFormValid()}>
                    Continuar al Pago
                </Button>
            </div>
        </div>
    );
}
