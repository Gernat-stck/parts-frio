import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditNotePayload } from '@/types/invoice';
import { CheckCircle, Download, FileText, Mail } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface CreditNotePreviewProps {
    formData: CreditNotePayload; // Usa el tipo correcto aquí
}

export default function CreditNotePreview({ formData }: CreditNotePreviewProps) {
    const handleCertify = () => {
        console.log('Certificando nota de crédito...');
        // Implementar lógica de certificación
    };

    const handleSendEmail = () => {
        console.log('Enviando por correo...');
        // Implementar lógica de envío de correo
    };

    const handleDownload = () => {
        console.log('Descargando nota de crédito...');
        // Implementar lógica de descarga
    };

    const handleViewXml = () => {
        console.log('Viendo XML...');
        // Implementar lógica para ver XML
    };

    return (
        <Card className="space-y-4 p-4">
            <ScrollArea className='w-90'>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Vista Previa</h3>
                    <Badge variant="secondary">Nota de Crédito</Badge>
                </div>

                <Separator />

                <div className="border-b pb-4 text-center">
                    <h4 className="text-lg font-bold">NOTA DE CRÉDITO ELECTRÓNICA</h4>
                    <p className="text-sm text-muted-foreground">DTE-05</p>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">No. Control:</span>
                        <span className="font-mono text-xs break-all">{formData.identificacion.numeroControl}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Código Gen.:</span>
                        <span className="font-mono text-xs break-all">{formData.identificacion.codigoGeneracion}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Fecha:</span>
                        <span>{formData.identificacion.fecEmi}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Hora:</span>
                        <span>{formData.identificacion.horEmi}</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <h5 className="font-semibold">Receptor</h5>
                    <div className="space-y-1 text-sm">
                        <p className="font-medium">{formData.receptor.nombre}</p>
                        {formData.receptor.nit && <p>NIT: {formData.receptor.nit}</p>}
                        {formData.receptor.nrc && <p>NRC: {formData.receptor.nrc}</p>}
                        <p className="text-xs text-muted-foreground">{formData.receptor.direccion.complemento}</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <h5 className="font-semibold">Resumen</h5>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${formData.resumen.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>IVA:</span>
                            <span>${(formData.resumen.ivaPerci1 || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-semibold">
                            <span>Total:</span>
                            <span>${formData.resumen.montoTotalOperacion.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h5 className="font-semibold">Acciones</h5>
                    <div className="grid grid-cols-1 gap-2">
                        <Button onClick={handleCertify} size="sm" className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Certificar NC
                        </Button>
                        <Button onClick={handleSendEmail} variant="outline" size="sm" className="w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar por Correo
                        </Button>
                        <Button onClick={handleDownload} variant="outline" size="sm" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Button>
                        <Button onClick={handleViewXml} variant="outline" size="sm" className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver XML
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </Card>
    );
}
