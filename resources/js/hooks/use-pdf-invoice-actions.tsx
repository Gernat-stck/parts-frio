/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePDFDownload } from '@/hooks/use-pdf-download';

export function usePDFInvoiceActions(filename: string) {
    const { downloadPDF, sendDTEEmail, printPDF } = usePDFDownload({ filename });

    const handleDownloadPDF = async (invoiceData: any, qrData?: string) => {
        const PDFInvoiceModule = await import('@/components/invoice/pdf-invoice');
        const PDFInvoice = PDFInvoiceModule.default;
        await downloadPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
    };

    const handleSendEmail = async (
        invoiceData: any,
        saleId: string | number ,
        qrData?: string,
    ) => {
        const PDFInvoiceModule = await import('@/components/invoice/pdf-invoice');
        const PDFInvoice = PDFInvoiceModule.default;
        await sendDTEEmail({
            pdfComponent: <PDFInvoice invoiceData={invoiceData} />,
            endpoint: route('admin.dte.send'),
            saleId ,
            qrData,
        });
    };

    const handlePrint = async (invoiceData: any, qrData?: string) => {
        const PDFInvoiceModule = await import('@/components/invoice/pdf-invoice');
        const PDFInvoice = PDFInvoiceModule.default;
        await printPDF(<PDFInvoice invoiceData={invoiceData} />, qrData);
    };

    return { handleDownloadPDF, handleSendEmail, handlePrint };
}