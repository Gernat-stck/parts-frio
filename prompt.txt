import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTAMENTS, DOCUMENTS_TYPES, MUNICIPALITIES_BY_DEPARTMENT } from '@/constants/salesConstants';
import type { Receiver } from '@/types/clientes';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ScrollArea } from '../ui/scroll-area';
import EconomicActivitySearch from './economic-activity-search';

function convertEmptyStringsToNull<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(convertEmptyStringsToNull) as unknown as T;
    } else if (obj !== null && typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' && value.trim() === '') {
                result[key] = null;
            } else {
                result[key] = convertEmptyStringsToNull(value);
            }
        }
        return result as T;
    }
    return obj;
}

// Schema base para todos los documentos
const baseReceiverSchema = z.object({
    tipoDocumento: z.string().min(1, 'Tipo de documento es requerido').optional(),
    numDocumento: z.string().min(1, 'Número de documento es requerido').optional(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    direccion: z.object({
        departamento: z.string().min(1, 'Departamento es requerido'),
        municipio: z.string().min(1, 'Municipio es requerido'),
        complemento: z.string().min(1, 'Dirección completa es requerida'),
    }),
    telefono: z
        .string()
        .min(1, 'Teléfono es requerido')
        .regex(/^\d{4}-?\d{4}$/, 'Formato de teléfono inválido (ej: 7123-4567)'),
    correo: z.email('Formato de correo inválido').optional().or(z.literal('')),
});

// Schema para documentos fiscales (CCF/NC)
const fiscalReceiverSchema = z.object({
    // tipoDocumento: z.string().min(1, 'Tipo de documento es requerido').optional(),
    // numDocumento: z.string().min(1, 'Número de documento es requerido').optional(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    nit: z
        .string()
        .min(1, 'NIT es requerido para documentos fiscales')
        .regex(/^\d{14}$/, 'NIT debe tener 14 dígitos'),
    nrc: z
        .string()
        .min(1, 'NRC es requerido para documentos fiscales')
        .regex(/^\d{1,8}$/, 'NRC debe tener entre 1 y 8 dígitos'),
    codActividad: z.string().min(1, 'Código de actividad económica es requerido'),
    descActividad: z.string().min(1, 'Descripción de actividad económica es requerida'),
    nombreComercial: z.string().min(1, 'Nombre comercial es requerido para documentos fiscales'),
    direccion: z.object({
        departamento: z.string().min(1, 'Departamento es requerido'),
        municipio: z.string().min(1, 'Municipio es requerido'),
        complemento: z.string().min(1, 'Dirección completa es requerida'),
    }),
    telefono: z
        .string()
        .min(1, 'Teléfono es requerido')
        .regex(/^\d{4}?\d{4}$/, 'Formato de teléfono inválido (ej: 71234567)'),
    correo: z.email('Formato de correo inválido').optional().or(z.literal('')),
});

// Schema condicional basado en el tipo de documento
const createReceiverSchema = (documentType: '01' | '03' | '05' | null | undefined) => {
    const isFiscalDocument = documentType === '03' || documentType === '05';
    return isFiscalDocument ? fiscalReceiverSchema : baseReceiverSchema;
};

interface CustomerDataStepProps {
    data: Receiver;
    setData: (data: Receiver) => void;
    onNext: (data: Receiver) => void;
    onPrev: () => void;
    documentType: '01' | '03' | '05' | null | undefined;
}

interface ValidationErrors {
    [key: string]: string;
}

export default function ClientFormStep({ data, setData, onNext, onPrev, documentType }: CustomerDataStepProps) {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const selectedDepartment = data.direccion.departamento;
    const filteredMunicipios = selectedDepartment ? (MUNICIPALITIES_BY_DEPARTMENT[selectedDepartment] ?? []) : [];

    const updateData = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (parent === 'direccion') {
                setData({
                    ...data,
                    direccion: {
                        ...data.direccion,
                        [child]: value,
                    },
                });
            }
        } else {
            setData({ ...data, [field]: value });
        }
    };

    const validateForm = () => {
        const schema = createReceiverSchema(documentType);
        const result = schema.safeParse(data);
        if (!result.success) {
            const newErrors: ValidationErrors = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                newErrors[path] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };
    const handleNext = () => {
        if (validateForm()) {
            const isFiscalDocument = documentType === '03' || documentType === '05';
            const finalData = { ...data };

            if (isFiscalDocument) {
                delete finalData.tipoDocumento;
                delete finalData.numDocumento;
            } else {
                delete finalData.nit;
                delete finalData.nombreComercial;
            }
            const cleanedFinalData = convertEmptyStringsToNull(finalData);


            setData(cleanedFinalData);
            onNext(cleanedFinalData); 
        } else {
            console.log('Formulario inválido. Errores:', errors);
        }
    };

    // Limpiar errores cuando cambia el tipo de documento
    useEffect(() => {
        setErrors({});
    }, [documentType]);

    const isFiscalDocument = documentType === '03' || documentType === '05';

    return (
        <div className="space-y-4 p-2 sm:space-y-6 sm:p-4">
            <ScrollArea className="h-[70vh]">
                <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 sm:px-6">
                        <CardTitle className="text-lg sm:text-xl">Datos del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0 sm:space-y-6 sm:px-6">
                        {!isFiscalDocument && (
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tipoDocumento" className="text-sm font-medium">
                                        Tipo de Documento *
                                    </Label>
                                    <Select value={data.tipoDocumento} onValueChange={(value) => updateData('tipoDocumento', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DOCUMENTS_TYPES.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['tipoDocumento'] && <p className="text-sm text-red-500">{errors['tipoDocumento']}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numDocumento" className="text-sm font-medium">
                                        Número de Documento *
                                    </Label>
                                    <Input
                                        id="numDocumento"
                                        value={data.numDocumento}
                                        onChange={(e) => updateData('numDocumento', e.target.value)}
                                        className={errors['numDocumento'] ? 'border-red-500' : ''}
                                        placeholder={data.tipoDocumento === '13' ? '12345678-9' : 'Número de documento'}
                                    />
                                    {errors['numDocumento'] && <p className="text-sm text-red-500">{errors['numDocumento']}</p>}
                                </div>
                            </div>
                        )}

                        {isFiscalDocument && (
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nit" className="text-sm font-medium">
                                        NIT * (14 dígitos)
                                    </Label>
                                    <Input
                                        id="nit"
                                        value={data.nit || ''}
                                        onChange={(e) => updateData('nit', e.target.value)}
                                        placeholder="06140202000000"
                                        className={errors['nit'] ? 'border-red-500' : ''}
                                        maxLength={14}
                                    />
                                    {errors['nit'] && <p className="text-sm text-red-500">{errors['nit']}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nrc" className="text-sm font-medium">
                                        NRC *
                                    </Label>
                                    <Input
                                        id="nrc"
                                        value={data.nrc || ''}
                                        onChange={(e) => updateData('nrc', e.target.value)}
                                        placeholder="87654321"
                                        className={errors['nrc'] ? 'border-red-500' : ''}
                                        maxLength={8}
                                    />
                                    {errors['nrc'] && <p className="text-sm text-red-500">{errors['nrc']}</p>}
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-sm font-medium">
                                Nombre Completo *
                            </Label>
                            <Input
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) => updateData('nombre', e.target.value)}
                                placeholder="Nombre completo del cliente"
                                className={errors['nombre'] ? 'border-red-500' : ''}
                            />
                            {errors['nombre'] && <p className="text-sm text-red-500">{errors['nombre']}</p>}
                        </div>

                        {isFiscalDocument && (
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombreComercial" className="text-sm font-medium">
                                        Nombre Comercial *
                                    </Label>
                                    <Input
                                        id="nombreComercial"
                                        value={data.nombreComercial || ''}
                                        onChange={(e) => updateData('nombreComercial', e.target.value)}
                                        placeholder="Nombre comercial del cliente"
                                        className={errors['nombreComercial'] ? 'border-red-500' : ''}
                                    />
                                    {errors['nombreComercial'] && <p className="text-sm text-red-500">{errors['nombreComercial']}</p>}
                                </div>

                                <div className="space-y-2">
                                    <EconomicActivitySearch
                                        codActividad={data.codActividad}
                                        descActividad={data.descActividad}
                                        onSelect={(value, label) => {
                                            setData({
                                                ...data,
                                                codActividad: value,
                                                descActividad: label,
                                            });
                                        }}
                                    />
                                    {errors['codActividad'] && <p className="text-sm text-red-500">{errors['codActividad']}</p>}
                                    {errors['descActividad'] && <p className="text-sm text-red-500">{errors['descActividad']}</p>}
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold sm:text-lg">Dirección</h3>

                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="departamento" className="text-sm font-medium">
                                        Departamento *
                                    </Label>
                                    <Select
                                        value={data.direccion.departamento}
                                        onValueChange={(value) => updateData('direccion.departamento', value)}
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
                                    {errors['direccion.departamento'] && <p className="text-sm text-red-500">{errors['direccion.departmento']}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="municipio" className="text-sm font-medium">
                                        Municipio *
                                    </Label>
                                    <Select
                                        value={data.direccion.municipio}
                                        onValueChange={(value) => updateData('direccion.municipio', value)}
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
                                    {errors['direccion.municipio'] && <p className="text-sm text-red-500">{errors['direccion.municipio']}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="complemento" className="text-sm font-medium">
                                    Dirección Completa *
                                </Label>
                                <Input
                                    id="complemento"
                                    value={data.direccion.complemento}
                                    onChange={(e) => updateData('direccion.complemento', e.target.value)}
                                    placeholder="Dirección completa (calle, colonia, casa, etc.)"
                                    className={errors['direccion.complemento'] ? 'border-red-500' : ''}
                                />
                                {errors['direccion.complemento'] && <p className="text-sm text-red-500">{errors['direccion.complemento']}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="telefono" className="text-sm font-medium">
                                    Teléfono * (formato: 12345678)
                                </Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => updateData('telefono', e.target.value)}
                                    placeholder="71234567"
                                    className={errors['telefono'] ? 'border-red-500' : ''}
                                />
                                {errors['telefono'] && <p className="text-sm text-red-500">{errors['telefono']}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="correo" className="text-sm font-medium">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="correo"
                                    type="email"
                                    value={data.correo}
                                    onChange={(e) => updateData('correo', e.target.value)}
                                    placeholder="cliente@email.com"
                                    className={errors['correo'] ? 'border-red-500' : ''}
                                />
                                {errors['correo'] && <p className="text-sm text-red-500">{errors['correo']}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={onPrev} className="w-full bg-transparent sm:w-auto">
                    Volver al Carrito
                </Button>
                <Button onClick={handleNext} className="w-full sm:w-auto">
                    Continuar al Pago
                </Button>
            </div>
        </div>
    );
}
