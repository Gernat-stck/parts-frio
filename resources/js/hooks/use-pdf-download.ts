/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentProps, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import saveAs from 'file-saver';
import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';
import { createRoot } from 'react-dom/client';

interface UsePDFDownloadProps {
    filename?: string;
}

interface SendDTEEmailParams {
    pdfComponent: React.ReactElement<any>; // Tipo laxo para aceptar tu PDFInvoice
    endpoint: string;
    saleId: number | string;
    qrData?: string;
    recipient?: string;
    message?: string;
    timeoutMs?: number;
    filenameOverride?: string;
    extra?: Record<string, string | number | boolean>;
}

export function usePDFDownload({ filename = 'factura' }: UsePDFDownloadProps = {}) {
    let logoCache: string | null = null;

    const waitNextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const generateQRCodeDataUrl = (data: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const qrComponent = React.createElement(QRCodeCanvas, {
                value: data,
                size: 140,
                level: 'M',
                includeMargin: true,
                bgColor: '#FFFFFF',
                fgColor: '#000000',
            });

            const root = createRoot(container);
            root.render(qrComponent);

            // Esperar frames
            waitNextFrame()
                .then(waitNextFrame)
                .then(() => {
                    const qrCanvas = container.querySelector('canvas') as HTMLCanvasElement | null;
                    if (!qrCanvas) throw new Error('No se pudo renderizar el canvas del QR');

                    const dataUrl = qrCanvas.toDataURL('image/png');
                    root.unmount();
                    container.remove();
                    resolve(dataUrl);
                })
                .catch((err) => {
                    root.unmount();
                    container.remove();
                    reject(err);
                });
        });
    };

    const getLogoAsBase64 = async (): Promise<string> => {
        try {
            if (logoCache) return logoCache;

            const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGOPARTSFRIOjpg.jpg-uVkJQ6tiQBKdTeWSq0vSSXForqokrz.jpeg';
            const response = await fetch(logoUrl);
            const blob = await response.blob();

            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            logoCache = base64;
            return base64;
        } catch {
            return 'data:image/svg+xml;base64,PHN2ZyB3a...'; // placeholder
        }
    };

    const buildEnhancedComponent = async (
        pdfComponent: React.ReactElement<Record<string, unknown>>,
        qrData?: string,
    ): Promise<React.ReactElement<any>> => {
        const [qrCodeDataUrl, logoBase64] = await Promise.all([
            qrData ? generateQRCodeDataUrl(qrData) : Promise.resolve(undefined),
            getLogoAsBase64(),
        ]);

        return React.cloneElement(pdfComponent, {
            ...(pdfComponent.props || {}),
            qrCodeDataUrl,
            logoUrl: logoBase64,
        });
    };

    const getPDFBlob = async (pdfComponent: React.ReactElement<any>, qrData?: string): Promise<Blob> => {
        const enhanced = await buildEnhancedComponent(pdfComponent, qrData);
        return await pdf(enhanced as React.ReactElement<DocumentProps>).toBlob();
    };

    const downloadPDF = async (pdfComponent: React.ReactElement<any>, qrData?: string) => {
        const blob = await getPDFBlob(pdfComponent, qrData);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        saveAs(blob, `${filename}-${timestamp}.pdf`);
        return true;
    };

    // 📧 Envío opcional
    const sendDTEEmail = async ({
        pdfComponent,
        endpoint,
        saleId,
        qrData,
        recipient,
        message,
        timeoutMs = 200000,
        filenameOverride,
        extra = {},
    }: SendDTEEmailParams) => {
        const blob = await getPDFBlob(pdfComponent, qrData);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const fname = `${filenameOverride ?? filename}-${timestamp}.pdf`;

        const form = new FormData();
        form.append('pdf', new File([blob], fname, { type: 'application/pdf' }));
        form.append('codigo_generacion', String(saleId));

        // Solo agregamos estos campos si el frontend quiere enviarlos
        if (recipient) form.append('recipient', recipient);
        if (message) form.append('message', message);

        for (const [k, v] of Object.entries(extra)) {
            form.append(k, String(v));
        }

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const { data } = await axios.post(endpoint, form, {
                signal: controller.signal, // AbortController desde axios 1.x+
                withCredentials: true, // asegura cookies, aunque ya lo tengas global
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            return data ?? {};
        } finally {
            clearTimeout(id);
        }
    };
    const printPdfFromBlob = async (pdfBlob: Blob) => {
        const url = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.src = url;

        return new Promise<void>((resolve, reject) => {
            const cleanup = () => {
                URL.revokeObjectURL(url);
                iframe.parentNode?.removeChild(iframe);
            };

            iframe.onload = () => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    cleanup();
                    reject(e);
                }
            };

            document.body.appendChild(iframe);
        });
    };
    const printPDF = async (pdfComponent: React.ReactElement, qrData?: string) => {
        const blob = await getPDFBlob(pdfComponent, qrData);
        await printPdfFromBlob(blob); // o la opción 1
    };

    return { downloadPDF, getPDFBlob, sendDTEEmail, printPdfFromBlob, printPDF };
}
