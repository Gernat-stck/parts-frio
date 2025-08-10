import { InvoicePayload } from '@/types/invoice';
import { QrCode } from 'lucide-react';
import React from 'react';

interface ElectronicInvoicePreviewProps {
    invoiceData?: InvoicePayload;
}

const ElectronicInvoicePreview: React.FC<ElectronicInvoicePreviewProps> = ({ invoiceData }) => {
    // Use the provided invoiceData or fall back to the sample data
    const sampleData: InvoicePayload = {
        identificacion: {
            version: 1,
            ambiente: '00',
            tipoDte: '01',
            numeroControl: 'DTE-01-00000001-000000000000001',
            codigoGeneracion: '1854CC6C-8811-4C5A-8489-4218339790FC',
            tipoModelo: 1,
            tipoOperacion: 1,
            tipoContingencia: null,
            motivoContin: null,
            fecEmi: '2023-11-21',
            horEmi: '10:16:11',
            tipoMoneda: 'USD',
        },
        emisor: {
            nit: '06142009100112',
            nrc: '54135',
            nombre: 'UNIVERSIDAD TECNOLOGICA DE EL SALVADOR',
            codActividad: '85422',
            descActividad: 'Enseñanza superior universitaria',
            nombreComercial: 'Universidad Tecnológica de El Salvador',
            direccion: {
                departamento: 'San Salvador',
                municipio: 'San Salvador',
                complemento: '17° AVENIDA NORTE Y CALLE ARCE, # 135, SAN SALVADOR, SAN SALVADOR',
            },
            telefono: '22798888',
            correo: 'facturacion@mail.utec.edu.sv',
            tipoEstablecimiento: 'Casa matriz', // Added this line to fix the Emitter type error
        },
        receptor: {
            tipoDocumento: 'DUI',
            numDocumento: '03574546-3',
            nombre: 'HENRY FRANCISCO MARTINEZ LOPEZ',
            direccion: {
                departamento: 'San Salvador',
                municipio: 'San Salvador',
                complemento: 'RESIDENCIAL ALTA VISTA, POLIGONO A, PASAJE 25 CASA #305',
            },
            telefono: '75428363',
            correo: '134872021@mail.utec.edu.sv',
            codActividad: null, // Added this line to fix the Receiver type error
            descActividad: null, // Added this line to fix the Receiver type error
            nombreComercial: null, // Added as a good practice
        },
        cuerpoDocumento: [
            {
                numItem: 1,
                tipoItem: 1,
                codigo: 'C-283',
                descripcion: 'C-283 Seminario Facturación Electrónica',
                cantidad: 1,
                uniMedida: 99,
                precioUni: 15.0,
                montoDescu: 0.0,
                ventaNoSuj: 0.0,
                ventaExenta: 0.0,
                ventaGravada: 15.0,
                numeroDocumento: null,
            },
        ],
        resumen: {
            totalNoSuj: 0.0,
            totalExenta: 0.0,
            totalGravada: 15.0,
            subTotalVentas: 15.0,
            descuNoSuj: 0.0,
            descuExenta: 0.0,
            descuGravada: 0.0,
            totalDescu: 0.0,
            subTotal: 15.0,
            montoTotalOperacion: 15.0,
            totalLetras: 'QUINCE 00/100 DÓLARES',
            condicionOperacion: 1,
        },
        documentoRelacionado: null,
        ventaTercero: null,
        extension: null,
        apendice: null,
    };

    const data = invoiceData || sampleData;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-SV', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-SV');
    };
    return (
        <div className="border-2 border-gray-400 bg-white p-6 font-sans text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* Placeholder para el logo */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white">
                        {/* Aquí puedes insertar la imagen del logo */}
                        UTEC
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-red-800">Universidad Tecnológica</h1>
                        <h2 className="text-lg font-bold text-red-800">de El Salvador</h2>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="mb-2 font-bold">DOCUMENTO TRIBUTARIO ELECTRÓNICO</h3>
                    <h4 className="font-bold">FACTURA</h4>
                </div>

                <div className="flex flex-col items-center">
                    <div className="mb-2 flex h-24 w-24 items-center justify-center border-2 border-gray-400 dark:border-gray-600">
                        <QrCode size={80} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="text-center text-xs">
                        <div>
                            <strong>Código de Generación:</strong>
                        </div>
                        <div className="break-all">{data.identificacion.codigoGeneracion}</div>
                        <div>
                            <strong>Número de Control:</strong>
                        </div>
                        <div className="break-all">{data.identificacion.numeroControl}</div>
                        <div>
                            <strong>Modelo de Facturación:</strong> Modelo Facturación previo
                        </div>
                        <div>
                            <strong>Tipo de Transmisión:</strong> Transmisión normal
                        </div>
                        <div>
                            <strong>Fecha y hora de generación:</strong> {formatDate(data.identificacion.fecEmi)} {data.identificacion.horEmi}
                        </div>
                        <div>
                            <strong>Forma de Pago:</strong> Transferencia, Depósito Bancario
                        </div>
                    </div>
                </div>
            </div>

            {/* Emisor y Receptor */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="border border-gray-400 p-3 dark:border-gray-600">
                    <h4 className="mb-2 text-center font-bold">EMISOR</h4>
                    <div className="space-y-1 text-xs">
                        <div>
                            <strong>Nombre o razón social:</strong> {data.emisor.nombre}
                        </div>
                        <div>
                            <strong>NIT:</strong> {data.emisor.nit}
                        </div>
                        <div>
                            <strong>NRC:</strong> {data.emisor.nrc}
                        </div>
                        <div>
                            <strong>Actividad económica:</strong> {data.emisor.descActividad}
                        </div>
                        <div>
                            <strong>Dirección:</strong> {data.emisor.direccion.complemento}
                        </div>
                        <div>
                            <strong>Teléfono:</strong> {data.emisor.telefono}
                        </div>
                        <div>
                            <strong>Correo:</strong> {data.emisor.correo}
                        </div>
                        <div>
                            <strong>Nombre Comercial:</strong> {data.emisor.nombreComercial}
                        </div>
                        <div>
                            <strong>Establecimiento:</strong> {data.emisor.tipoEstablecimiento}
                        </div>
                    </div>
                </div>

                <div className="border border-gray-400 p-3 dark:border-gray-600">
                    <h4 className="mb-2 text-center font-bold">RECEPTOR</h4>
                    <div className="space-y-1 text-xs">
                        <div>
                            <strong>Nombre o razón social:</strong> {data.receptor.nombre}
                        </div>
                        <div>
                            <strong>Documento:</strong> {data.receptor.numDocumento}
                        </div>
                        <div>
                            <strong>Dirección:</strong> {data.receptor.direccion.complemento}
                        </div>
                        <div>
                            <strong>Teléfono:</strong> {data.receptor.telefono}
                        </div>
                        <div>
                            <strong>Correo:</strong> {data.receptor.correo}
                        </div>
                    </div>
                </div>
            </div>

            {/* Documentos Relacionados */}
            <div className="mb-4">
                <h4 className="mb-2 text-center font-bold">DOCUMENTOS RELACIONADOS</h4>
                <table className="w-full border border-gray-400 text-xs dark:border-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Tipo de Documento</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">No. de Documento</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Fecha del Documento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.documentoRelacionado && data.documentoRelacionado.length > 0 ? (
                            data.documentoRelacionado.map((doc, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{doc.tipoDocumento}</td>
                                    <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{doc.numeroDocumento}</td>
                                    <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{doc.fechaEmision}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border border-gray-400 p-1 text-center dark:border-gray-600" colSpan={3}>
                                    No hay documentos asociados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detalle de productos */}
            <div className="mb-4">
                <h4 className="mb-2 text-center font-bold">DETALLE DE PRODUCTOS</h4>
                <table className="w-full border border-gray-400 text-xs dark:border-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">No.</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Cantidad</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Código</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Descripción</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Precio Unitario</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Descuento por ítem</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Venta No Sujeta</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Venta Exenta</th>
                            <th className="border border-gray-400 p-1 dark:border-gray-600">Venta Gravada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.cuerpoDocumento.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{item.numItem}</td>
                                <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{item.cantidad}</td>
                                <td className="border border-gray-400 p-1 text-center dark:border-gray-600">{item.codigo}</td>
                                <td className="border border-gray-400 p-1 dark:border-gray-600">{item.descripcion}</td>
                                <td className="border border-gray-400 p-1 text-right dark:border-gray-600">{formatCurrency(item.precioUni)}</td>
                                <td className="border border-gray-400 p-1 text-right dark:border-gray-600">{formatCurrency(item.montoDescu)}</td>
                                <td className="border border-gray-400 p-1 text-right dark:border-gray-600">{formatCurrency(item.ventaNoSuj)}</td>
                                <td className="border border-gray-400 p-1 text-right dark:border-gray-600">{formatCurrency(item.ventaExenta)}</td>
                                <td className="border border-gray-400 p-1 text-right dark:border-gray-600">{formatCurrency(item.ventaGravada)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            <td colSpan={6} className="border border-gray-400 p-1 text-right font-bold dark:border-gray-600">
                                Suma de Ventas
                            </td>
                            <td className="border border-gray-400 p-1 text-right font-bold dark:border-gray-600">
                                {formatCurrency(data.resumen.totalNoSuj)}
                            </td>
                            <td className="border border-gray-400 p-1 text-right font-bold dark:border-gray-600">
                                {formatCurrency(data.resumen.totalExenta)}
                            </td>
                            <td className="border border-gray-400 p-1 text-right font-bold dark:border-gray-600">
                                {formatCurrency(data.resumen.totalGravada)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Resumen de totales */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div></div>
                <div className="border border-gray-400 dark:border-gray-600">
                    <table className="w-full text-xs">
                        <tbody>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Sub-Total Ventas No Sujetas:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.totalNoSuj)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Sub-Total Ventas Exentas:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.totalExenta)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Sub-Total Ventas Gravadas:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.totalGravada)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Descuentos No Sujetos:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.descuNoSuj)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Descuentos Exentos:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.descuExenta)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 dark:border-gray-600">Descuentos Gravados:</td>
                                <td className="border-b border-gray-300 p-1 text-right dark:border-gray-600">
                                    {formatCurrency(data.resumen.descuGravada)}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-b border-gray-300 p-1 font-bold dark:border-gray-600">Sub-Total</td>
                                <td className="border-b border-gray-300 p-1 text-right font-bold dark:border-gray-600">
                                    {formatCurrency(data.resumen.subTotal)}
                                </td>
                            </tr>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <td className="border-b border-gray-300 p-1 font-bold dark:border-gray-600">Total a Pagar:</td>
                                <td className="border-b border-gray-300 p-1 text-right font-bold dark:border-gray-600">
                                    {formatCurrency(data.resumen.montoTotalOperacion)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Valor en letras y condición */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="border border-gray-400 p-2 dark:border-gray-600">
                    <div className="text-xs">
                        <strong>Valor en letras:</strong> {data.resumen.totalLetras}
                    </div>
                </div>
                <div className="border border-gray-400 p-2 dark:border-gray-600">
                    <div className="text-center text-xs">
                        <strong>Condición de la operación:</strong>
                        <br />
                        {data.resumen.condicionOperacion === 1 ? 'Contado' : 'Crédito'}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-4 border border-gray-400 dark:border-gray-600">
                <div className="p-2 text-xs">
                    <strong>Responsable por parte del Emisor:</strong> Firma en línea UTEC
                </div>
                <div className="p-2 text-xs">
                    <strong>Responsable por parte del Receptor:</strong> {data.receptor.nombre}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-r border-b border-l border-gray-400 dark:border-gray-600">
                <div className="p-2 text-xs">
                    <strong>N° de Documento:</strong> {data.emisor.nit}
                </div>
                <div className="p-2 text-xs">
                    <strong>N° de Documento:</strong> {data.receptor.numDocumento}
                </div>
            </div>
        </div>
    );
};

export default ElectronicInvoicePreview;
