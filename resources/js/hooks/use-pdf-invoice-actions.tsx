/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePDFDownload } from '@/hooks/use-pdf-download';
import type { ComponentType } from 'react';

const modules = import.meta.glob<{
    default: ComponentType<{ invoiceData: any }>;
}>('@/components/invoice/pdf-invoice.tsx');

export function usePDFInvoiceActions(filename: string) {
    const { downloadPDF, sendDTEEmail, printPDF } = usePDFDownload({ filename });

    const loadPDFInvoice = async () => {
        const module = await modules['/resources/js/components/invoice/pdf-invoice.tsx']();
        return module.default;
    };

    const handleDownloadPDF = async (invoiceData: any, qrData?: string) => {
        const PDFInvoice = await loadPDFInvoice();
        await downloadPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
    };

    const handleSendEmail = async (invoiceData: any, saleId: string | number, qrData?: string) => {
        const PDFInvoice = await loadPDFInvoice();
        await sendDTEEmail({
            pdfComponent: <PDFInvoice invoiceData={invoiceData} />,
            endpoint: route('admin.dte.send'),
            saleId,
            qrData,
        });
    };

    const handlePrint = async (invoiceData: any, qrData?: string) => {
        const PDFInvoice = await loadPDFInvoice();
        await printPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
    };

    return { handleDownloadPDF, handleSendEmail, handlePrint };
}
