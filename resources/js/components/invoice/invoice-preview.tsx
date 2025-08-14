import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateInvoiceData } from '@/helpers/generadores';
import { usePDFDownload } from '@/hooks/use-pdf-download';
import type { Receiver } from '@/types/clientes';
import type { CartItem, InvoicePayload, Payment } from '@/types/invoice';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Award, Download, FilePlus2Icon, Mail, PrinterIcon as Print } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import LoaderCute from '../loader/loader-page';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { DynamicInvoice } from './dynamic-invoice';
import { PDFInvoice } from './pdf-invoice';

interface InvoiceStepProps {
    cartItems: CartItem[];
    customerData: Receiver;
    paymentData: Payment;
    onPrev: () => void;
}

export default function InvoiceStep({ cartItems, customerData, paymentData, onPrev }: InvoiceStepProps) {
    const dteType = localStorage.getItem('typeDte') || '01';

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCertificate, setIsCertificate] = useState<boolean>(false);

    // Mantén dos piezas: el DTE renderizable y el identificador de venta
    const [invoiceData, setInvoiceData] = useState<InvoicePayload>(generateInvoiceData({ cartItems, customerData, paymentData, dteType }));
    const [saleId, setSaleId] = useState<number | string | null>(null);

    const invoiceRef = useRef<HTMLDivElement | null>(null);

    const [filename, setFilename] = useState<string>(`factura-${invoiceData?.identificacion?.numeroControl || 'sin-control'}`);

    const { downloadPDF, sendDTEEmail, printPDF } = usePDFDownload({ filename });

    const onCertificate = async () => {
        if (!invoiceData) {
            toast.error('Datos de factura no generados');
            return;
        }

        setIsLoading(true);

        try {
            // Envías la data para certificar
            const response = await axios.post(route('admin.save.invoice', { tipoDte: dteType }), { invoiceData });
            const { invoiceData: updatedInvoiceData, isCertificate: isCert, message } = response.data;
            // Si backend devuelve json_enviado como string, parsear para PDF
            const parsed =
                typeof updatedInvoiceData?.json_enviado === 'string'
                    ? JSON.parse(updatedInvoiceData.json_enviado)
                    : (updatedInvoiceData?.json_enviado ?? updatedInvoiceData);

            setInvoiceData(parsed);
            setIsCertificate(Boolean(isCert));
            const numeroControl = parsed?.identificacion?.numeroControl ?? updatedInvoiceData?.identificacion?.numeroControl ?? 'sin-control';

            setFilename(`factura-${numeroControl}`);

            // Guarda saleId para el envío del correo luego
            setSaleId(updatedInvoiceData?.codigoGeneracion ?? null);

            toast.success(message || 'Documento certificado');
        } catch (error) {
            console.error('Error al certificar:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Ocurrió un error al certificar el documento.';
                toast.error(errorMessage);
            } else {
                toast.error('Ocurrió un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onCreateNewSale = () => {
        localStorage.removeItem('cart');
        localStorage.removeItem('client');
        localStorage.removeItem('payment');
        localStorage.removeItem('typeDte');
        setIsCertificate(false);
        setSaleId(null);
        router.get(route('admin.sales'));
    };

    const buildQrData = () => {
        const id = invoiceData?.identificacion;
        if (!id?.ambiente || !id?.codigoGeneracion || !id?.fecEmi) return undefined;
        return `https://admin.factura.gob.sv/consultaPublica?ambiente=${id.ambiente}&codGen=${id.codigoGeneracion}&fechaEmi=${id.fecEmi}`;
    };

    const handleDownloadPDF = async () => {
        try {
            const qrData = buildQrData();
            await downloadPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
            toast.success('PDF generado exitosamente');
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            toast.error('Error al generar el PDF');
        }
    };

    // OPCIONAL: enviar correo. El backend usa su template propio.
    const handleSendEmail = async () => {
        if (!isCertificate) {
            toast.error('Debes certificar antes de enviar el DTE por correo.');
            return;
        }
        if (!saleId) {
            toast.error('No se obtuvo el identificador de la venta (sale_id).');
            return;
        }
        console.log('ID', saleId);
        try {
            setIsLoading(true);

            const qrData = buildQrData();

            // Solo enviamos lo mínimo: PDF y sale_id. El backend arma el template y toma json_enviado.
            await sendDTEEmail({
                pdfComponent: <PDFInvoice invoiceData={invoiceData} />,
                endpoint: route('admin.dte.send'), // Ajusta al endpoint real: p.ej. '/api/dte/send'
                saleId,
                qrData,
                // Si quieres mantenerlo 100% opcional, NO envíes recipient/message aquí.
                // recipient: invoiceData?.receptor?.correo, // opcional
                // message: 'Gracias por tu compra...',     // opcional (el backend ya tiene template)
            });

            toast.success('DTE enviado por correo');
        } catch (error) {
            console.error('Error al enviar DTE por correo:', error);
            toast.error('No se pudo enviar el DTE por correo');
        } finally {
            setIsLoading(false);
        }
    };
    const handlePrint = async () => {
        try {
            const qrData = buildQrData();
            await printPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
        } catch {
            toast.error('No se pudo imprimir el documento');
        }
    };

    if (isLoading) {
        return <LoaderCute description="Estamos validando informacion con hacienda, espera un momento." />;
    }

    return (
        <div className="flex h-full w-full flex-col">
            {!isLoading && (
                <ScrollArea className="h-[80vh]">
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4 p-2 sm:space-y-6 sm:p-4">
                            {/* Actions - Responsive */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                                {/* Botón Volver al Pago */}
                                <Button variant="outline" onClick={onPrev} className="w-full bg-transparent sm:flex-1">
                                    Volver al Pago
                                </Button>

                                {/* Botón Certificar */}
                                <Button className="hover w-full border bg-yellow-50 text-black hover:bg-yellow-300 sm:flex-1" onClick={onCertificate}>
                                    <Award className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Certificar</span>
                                    <span className="sm:hidden">Cert.</span>
                                </Button>

                                {/* Botón Generar Nueva venta */}
                                <Button variant="outline" type="button" onClick={onCreateNewSale} className="w-full bg-transparent sm:flex-1">
                                    <FilePlus2Icon />
                                    Generar Nueva venta
                                </Button>

                                {/* Botón Descargar PDF */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full sm:flex-1" aria-describedby={!isCertificate ? 'tooltip-download' : undefined}>
                                            <Button
                                                variant="outline"
                                                onClick={handleDownloadPDF}
                                                disabled={isLoading || !isCertificate}
                                                className="w-full bg-transparent" // Elimina la clase sm:flex-1 aquí
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                <span className="hidden sm:inline">Descargar PDF</span>
                                                <span className="sm:hidden">PDF</span>
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>{!isCertificate && <p>Certifica el documento para poder descargarlo</p>}</TooltipContent>
                                </Tooltip>

                                {/* Botón Enviar por Email */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full sm:flex-1" aria-describedby={!isCertificate ? 'tooltip-email' : undefined}>
                                            <Button
                                                variant="outline"
                                                disabled={!isCertificate}
                                                className="w-full bg-transparent"
                                                onClick={handleSendEmail}
                                            >
                                                <Mail className="mr-2 h-4 w-4" />
                                                <span className="hidden sm:inline">Enviar por Email</span>
                                                <span className="sm:hidden">Email</span>
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent id="tooltip-email">
                                        {!isCertificate && <p>Certifica el documento para poder enviarlo por email</p>}
                                    </TooltipContent>
                                </Tooltip>

                                {/* Botón Imprimir */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full sm:flex-1" aria-describedby={!isCertificate ? 'tooltip-print' : undefined}>
                                            <Button
                                                variant="outline"
                                                disabled={!isCertificate}
                                                onClick={handlePrint}
                                                className="w-full bg-transparent" // Elimina la clase sm:flex-1 aquí
                                            >
                                                <Print className="mr-2 h-4 w-4" />
                                                <span className="hidden sm:inline">Imprimir</span>
                                                <span className="sm:hidden">Print</span>
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent id="tooltip-print">
                                        {!isCertificate && <p>Certifica el documento para poder imprimirlo</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div ref={invoiceRef}>
                                <DynamicInvoice invoiceData={invoiceData} />
                            </div>
                            {/* JSON Preview - Collapsible on mobile */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Datos JSON</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="max-h-52 overflow-auto rounded bg-accent p-2 text-sm break-all whitespace-pre-wrap sm:max-h-60 sm:p-4 dark:bg-accent">
                                        <ScrollArea className="h-52">{JSON.stringify(invoiceData, null, 2)}</ScrollArea>
                                    </pre>
                                </CardContent>
                            </Card>

                            {/* Bottom padding for mobile */}
                            <div className="h-4 sm:h-0" />
                        </div>
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
