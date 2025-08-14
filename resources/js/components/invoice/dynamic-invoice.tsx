import { CreditNotePayload, InvoicePayload } from '@/types/invoice';
import { QRCodeSVG } from 'qrcode.react';
import PF from '../LOGOPARTSFRIOjpg.jpg';
import { Card } from '../ui/card';
type BaseResumen = {
    total?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

interface DynamicInvoiceProps {
    invoiceData: (InvoicePayload | CreditNotePayload) & { resumen: BaseResumen };
    logoUrl?: string;
}

const tipoDteMap: Record<string, string> = {
    '01': 'FACTURA CONSUMIDOR FINAL',
    '03': 'COMPROBANTE CREDITO FISCAL',
    '05': 'NOTA DE CREDITO',
};

export function DynamicInvoice({ invoiceData, logoUrl }: DynamicInvoiceProps) {
    const { identificacion, emisor, receptor, cuerpoDocumento, resumen } = invoiceData;
    console.log('invoice', invoiceData);
    // Formatear fecha y hora
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES');
    };
    const tipoDte = tipoDteMap[identificacion.tipoDte] ?? '';

    const formatCurrency = (amount: number, decimales?: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: identificacion.tipoMoneda || 'USD',
            minimumFractionDigits: decimales || 2,
        }).format(amount);
    };
    const qrUrl = `https://admin.factura.gob.sv/consultaPublica?ambiente=${identificacion.ambiente}&codGen=${identificacion.codigoGeneracion}&fechaEmi=${identificacion.fecEmi}`;
    return (
        <div className="mx-auto max-w-4xl rounded-lg border-2 p-6 shadow-lg">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mb-4 flex items-start justify-between">
                    {/* Logo space */}
                    <div className="flex h-24 w-24 items-center justify-center">
                        {logoUrl || PF ? (
                            <img src={logoUrl || PF} alt="Logo de la institución" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-gray-300 text-xs text-gray-500">
                                Logo
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center">
                        <h1 className="mb-2 text-lg font-bold">DOCUMENTO TRIBUTARIO ELECTRÓNICO</h1>
                        <h2 className="text-base font-semibold">{tipoDte}</h2>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                        <div>Ver. {identificacion.version}</div>
                    </div>
                </div>

                {/* Document info and QR */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="rounded border-2 border-blue-500 p-3 text-left text-xs">
                        <div>
                            <strong>Código de Generación:</strong> {identificacion.codigoGeneracion}
                        </div>
                        <div>
                            <strong>Número de Control:</strong> {identificacion.numeroControl}
                        </div>
                        <div>
                            <strong>Sello de recepción:</strong> {invoiceData.sello_recibido}
                        </div>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center border border-gray-300">
                        {qrUrl ? <QRCodeSVG value={qrUrl} /> : <div className="text-xs text-gray-500">QR</div>}
                    </div>

                    <div className="text-right text-xs">
                        <div>
                            <strong>Modelo de Facturación:</strong> Previo
                        </div>
                        <div>
                            <strong>Tipo de Transmisión:</strong> Normal
                        </div>
                        <div>
                            <strong>Fecha y Hora de Generación:</strong> {formatDate(identificacion.fecEmi)} {identificacion.horEmi}
                        </div>
                    </div>
                </div>
            </div>

            {/* Emisor y Receptor */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                {/* Emisor */}
                <Card className="p-4">
                    <h3 className="mb-3 bg-accent py-1 text-center font-bold dark:text-accent-foreground">EMISOR</h3>
                    <div className="space-y-1 text-xs">
                        <div>
                            <strong>Nombre o razón social:</strong> {emisor.nombre}
                        </div>
                        <div>
                            <strong>NIT:</strong> {emisor.nit}
                        </div>
                        <div>
                            <strong>NRC:</strong> {emisor.nrc}
                        </div>
                        <div>
                            <strong>Actividad económica:</strong> {emisor.descActividad}
                        </div>
                        <div>
                            <strong>Dirección:</strong> {emisor.direccion.complemento}, {emisor.direccion.municipio}, {emisor.direccion.departamento}
                        </div>
                        <div>
                            <strong>Número de teléfono:</strong> {emisor.telefono}
                        </div>
                        <div>
                            <strong>Correo electrónico:</strong> {emisor.correo}
                        </div>
                        <div>
                            <strong>Nombre comercial:</strong> {emisor.nombreComercial}
                        </div>
                        <div>
                            <strong>Tipo de establecimiento:</strong> {emisor.tipoEstablecimiento}
                        </div>
                    </div>
                </Card>

                {/* Receptor */}
                <Card className="p-4">
                    <h3 className="mb-3 bg-accent py-1 text-center font-bold">RECEPTOR</h3>
                    <div className="space-y-1 text-xs">
                        <div>
                            <strong>Nombre o razón social:</strong> {receptor.nombre}
                        </div>
                        <div>
                            <strong>NIT:</strong> {receptor.nit}
                        </div>
                        <div>
                            <strong>NRC:</strong> {receptor.nrc}
                        </div>
                        <div>
                            <strong>Actividad económica:</strong> {receptor.descActividad}
                        </div>
                        <div>
                            <strong>Dirección:</strong> {receptor.direccion.complemento}, {receptor.direccion.municipio},{' '}
                            {receptor.direccion.departamento}
                        </div>
                        <div>
                            <strong>Correo electrónico:</strong> {receptor.correo}
                        </div>
                        <div>
                            <strong>Nombre comercial:</strong> {receptor.nombreComercial}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabla de productos */}
            <div className="mb-6">
                <table className="w-full border-collapse border border-gray-400 text-xs">
                    <thead>
                        <tr className="bg-accent">
                            <th className="border border-gray-400 p-2">N°</th>
                            <th className="border border-gray-400 p-2">Cantidad</th>
                            <th className="border border-gray-400 p-2">Unidad</th>
                            <th className="border border-gray-400 p-2">Descripción</th>
                            <th className="border border-gray-400 p-2">Precio Unitario</th>
                            <th className="border border-gray-400 p-2">Descuento por Ítem</th>
                            <th className="border border-gray-400 p-2">Otros montos no afectos</th>
                            <th className="border border-gray-400 p-2">Ventas No Sujetas</th>
                            <th className="border border-gray-400 p-2">Ventas Exentas</th>
                            <th className="border border-gray-400 p-2">Ventas Gravadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuerpoDocumento.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 p-2 text-center">{item.numItem}</td>
                                <td className="border border-gray-400 p-2 text-center">{item.cantidad}</td>
                                <td className="border border-gray-400 p-2 text-center">UNIDAD</td>
                                <td className="border border-gray-400 p-2">{item.descripcion}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.precioUni, 3)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.montoDescu, 3)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.ventaNoSuj)}</td>
                                <td className="border border-gray-400 p-2 text-right">-</td>
                                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.ventaExenta)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.ventaGravada)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div></div>
                <div className="text-xs">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-1 text-right font-semibold">SUMA DE VENTAS:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.subTotalVentas)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Suma Total de Operaciones:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.montoTotalOperacion)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Monto global Desc., Rebajas y otras a ventas no sujetas:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.descuNoSuj)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Monto global Desc., Rebajas y otras a ventas Exentas:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.descuExenta)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Monto global Desc., Rebajas y otras a ventas Gravadas:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.descuGravada)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right font-semibold">IVA 13%:</td>
                                <td className="border-b border-gray-300 py-1 text-right">
                                    {formatCurrency(
                                        resumen.totalIva !== undefined
                                            ? resumen.totalIva
                                            : Array.isArray(resumen.tributos) && resumen.tributos[0]?.valor !== undefined
                                              ? resumen.tributos[0].valor
                                              : 0,
                                    )}
                                    ;
                                </td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right font-semibold">Sub-Total:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.subTotal)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">IVA Percibido:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.ivaPerci1 || 0)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">IVA Retenido:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.ivaRete1 || 0)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Retención Renta:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.reteRenta || 0)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right font-bold">Monto Total de la Operación:</td>
                                <td className="border-b-2 border-gray-400 py-1 text-right font-bold">
                                    {formatCurrency(resumen.montoTotalOperacion)}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right">Total Otros montos no afectos:</td>
                                <td className="border-b border-gray-300 py-1 text-right">{formatCurrency(resumen.totalNoGravado || 0)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-right font-bold">Total a Pagar:</td>
                                <td className="border-b-2 border-gray-400 py-1 text-right font-bold">
                                    {formatCurrency(resumen.total || resumen.montoTotalOperacion)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Información adicional */}
            <div className="mb-4 border border-gray-400 p-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <strong>Valor en Letras:</strong> {resumen.totalLetras}
                    </div>
                    <div>
                        <strong>Condición de la Operación:</strong> {resumen.condicionOperacion === 1 ? 'Contado' : 'Crédito'}
                    </div>
                </div>
                <div className="mt-2 text-xs">
                    <strong>Observaciones:</strong> ___
                </div>
            </div>

            {/* Responsables */}
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-400 p-2">
                    <strong>Responsable por parte del emisor:</strong> {emisor.nombre}
                </div>
                <div className="border border-gray-400 p-2">
                    <strong>N° de Documento:</strong> {emisor.nit}
                </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-400 p-2">
                    <strong>Responsable por parte del Receptor:</strong> {receptor.nombre}
                </div>
                <div className="border border-gray-400 p-2">
                    <strong>N° de Documento:</strong> {receptor.nit}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-right text-xs text-gray-500">Página 1 de 1</div>
        </div>
    );
}
