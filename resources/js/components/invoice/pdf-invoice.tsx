import type { CreditNotePayload, InvoicePayload } from '@/types/invoice';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

type BaseResumen = {
    total?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

interface PDFInvoiceProps {
    invoiceData: (InvoicePayload | CreditNotePayload) & { resumen: BaseResumen };
    logoUrl?: string;
    qrCodeDataUrl?: string;
}

const tipoDteMap: Record<string, string> = {
    '01': 'FACTURA CONSUMIDOR FINAL',
    '03': 'COMPROBANTE CREDITO FISCAL',
    '05': 'NOTA DE CREDITO',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 15, // Reducido padding para aprovechar mejor el espacio
        fontSize: 9, // Reducido tamaño de fuente base
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 15, // Reducido margen
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12, // Reducido margen
    },
    logo: {
        width: 80, // Aumentado tamaño del logo
        height: 60,
        objectFit: 'contain',
    },
    logoPlaceholder: {
        width: 80,
        height: 60,
        border: '2px dashed #ccc',
        textAlign: 'center',
        paddingTop: 25,
        fontSize: 8,
        color: '#666',
    },
    headerCenter: {
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 15, // Reducido padding
    },
    title: {
        fontSize: 13, // Reducido tamaño
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 11, // Reducido tamaño
        fontWeight: 'bold',
    },
    version: {
        fontSize: 8,
        color: '#666',
        textAlign: 'right',
    },
    documentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15, // Reducido margen
    },
    infoBox: {
        border: '2px solid #3B82F6',
        padding: 8, // Reducido padding
        borderRadius: 5,
        fontSize: 7, // Reducido tamaño de fuente
        flex: 1,
        marginRight: 10,
    },
    qrCode: {
        // Nuevo estilo para código QR real
        width: 70,
        height: 70,
        objectFit: 'contain',
    },
    qrPlaceholder: {
        width: 70, // Aumentado tamaño
        height: 70,
        border: '1px solid #ccc',
        textAlign: 'center',
        paddingTop: 30,
        fontSize: 8,
        color: '#666',
    },
    rightInfo: {
        fontSize: 7, // Reducido tamaño
        textAlign: 'right',
        maxWidth: 140, // Reducido ancho máximo
        flex: 1,
        marginLeft: 10,
    },
    twoColumns: {
        flexDirection: 'row',
        marginBottom: 15, // Reducido margen
        gap: 8, // Reducido gap
    },
    column: {
        flex: 1,
        border: '1px solid #ccc',
        padding: 8, // Reducido padding
        borderRadius: 5,
    },
    columnHeader: {
        backgroundColor: '#f3f4f6',
        padding: 4, // Reducido padding
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8, // Reducido margen
        borderRadius: 3,
        fontSize: 8, // Reducido tamaño
    },
    fieldRow: {
        marginBottom: 2, // Reducido margen
        fontSize: 7, // Reducido tamaño
    },
    bold: {
        fontWeight: 'bold',
    },
    table: {
        marginBottom: 15, // Reducido margen
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #ccc',
        borderTop: '1px solid #ccc',
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ccc',
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
    },
    tableCell: {
        padding: 3, // Reducido padding
        borderRight: '1px solid #ccc',
        fontSize: 7, // Reducido tamaño
        textAlign: 'center',
    },
    tableCellLast: {
        padding: 3,
        fontSize: 7,
        textAlign: 'center',
    },
    tableCellDescription: {
        padding: 3,
        borderRight: '1px solid #ccc',
        fontSize: 7,
        textAlign: 'left',
        flex: 2,
    },
    tableCellRight: {
        padding: 3,
        borderRight: '1px solid #ccc',
        fontSize: 7,
        textAlign: 'right',
    },
    totalsSection: {
        flexDirection: 'row',
        marginBottom: 15, // Reducido margen
    },
    totalsTable: {
        flex: 1,
        marginLeft: '50%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 1, // Reducido padding
        borderBottom: '1px solid #ccc',
        fontSize: 7, // Reducido tamaño
    },
    totalRowBold: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
        borderBottom: '2px solid #333',
        fontSize: 7,
        fontWeight: 'bold',
    },
    additionalInfo: {
        border: '1px solid #ccc',
        padding: 8, // Reducido padding
        marginBottom: 12, // Reducido margen
        borderRadius: 5,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4, // Reducido margen
        fontSize: 7, // Reducido tamaño
    },
    responsibleSection: {
        flexDirection: 'row',
        gap: 8, // Reducido gap
        marginBottom: 8, // Reducido margen
    },
    responsibleBox: {
        flex: 1,
        border: '1px solid #ccc',
        padding: 6, // Reducido padding
        fontSize: 7, // Reducido tamaño
    },
    footer: {
        textAlign: 'right',
        fontSize: 7, // Reducido tamaño
        color: '#666',
        marginTop: 10, // Reducido margen
    },
});

export function PDFInvoice({ invoiceData, logoUrl, qrCodeDataUrl }: PDFInvoiceProps) {
    const { identificacion, emisor, receptor, cuerpoDocumento, resumen } = invoiceData;

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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        {/* Logo */}
                        <View>
                            <Image src={logoUrl || '/images/logo-partsfrio.png'} style={styles.logo} />
                        </View>

                        {/* Center Title */}
                        <View style={styles.headerCenter}>
                            <Text style={styles.title}>DOCUMENTO TRIBUTARIO ELECTRÓNICO</Text>
                            <Text style={styles.subtitle}>{tipoDte}</Text>
                        </View>

                        {/* Version */}
                        <View>
                            <Text style={styles.version}>Ver. {identificacion.version}</Text>
                        </View>
                    </View>

                    {/* Document Info */}
                    <View style={styles.documentInfo}>
                        <View style={styles.infoBox}>
                            <Text style={styles.bold}>Código de Generación: {identificacion.codigoGeneracion}</Text>
                            <Text style={styles.bold}>Número de Control: {identificacion.numeroControl}</Text>
                            <Text style={styles.bold}>Sello de recepción: {invoiceData.sello_recibido}</Text>
                        </View>

                        <View>
                            {qrCodeDataUrl ? (
                                <Image src={qrCodeDataUrl || '/placeholder.svg'} style={styles.qrCode} />
                            ) : (
                                <View style={styles.qrPlaceholder}>
                                    <Text>QR</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.rightInfo}>
                            <Text style={styles.bold}>Modelo de Facturación: Previo</Text>
                            <Text style={styles.bold}>Tipo de Transmisión: Normal</Text>
                            <Text style={styles.bold}>
                                Fecha y Hora de Generación: {formatDate(identificacion.fecEmi)} {identificacion.horEmi}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Emisor y Receptor */}
                <View style={styles.twoColumns}>
                    {/* Emisor */}
                    <View style={styles.column}>
                        <Text style={styles.columnHeader}>EMISOR</Text>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Nombre o razón social:</Text> {emisor.nombre}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>NIT:</Text> {emisor.nit}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>NRC:</Text> {emisor.nrc}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Actividad económica:</Text> {emisor.descActividad}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Dirección:</Text> {emisor.direccion.complemento}, {emisor.direccion.municipio},{' '}
                                {emisor.direccion.departamento}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Teléfono:</Text> {emisor.telefono}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Correo:</Text> {emisor.correo}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Nombre comercial:</Text> {emisor.nombreComercial}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Tipo de establecimiento:</Text> {emisor.tipoEstablecimiento}
                            </Text>
                        </View>
                    </View>

                    {/* Receptor */}
                    <View style={styles.column}>
                        <Text style={styles.columnHeader}>RECEPTOR</Text>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Nombre o razón social:</Text> {receptor.nombre}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>NIT:</Text> {receptor.nit}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>NRC:</Text> {receptor.nrc}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Actividad económica:</Text> {receptor.descActividad}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Dirección:</Text> {receptor.direccion.complemento}, {receptor.direccion.municipio},{' '}
                                {receptor.direccion.departamento}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Correo:</Text> {receptor.correo}
                            </Text>
                        </View>
                        <View style={styles.fieldRow}>
                            <Text>
                                <Text style={styles.bold}>Nombre comercial:</Text> {receptor.nombreComercial}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tabla de productos */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>N°</Text>
                        <Text style={[styles.tableCell, { flex: 0.8 }]}>Cantidad</Text>
                        <Text style={[styles.tableCell, { flex: 0.8 }]}>Unidad</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Descripción</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Precio Unit.</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Descuento</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Otros montos</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>V. No Sujetas</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>V. Exentas</Text>
                        <Text style={[styles.tableCellLast, { flex: 1 }]}>V. Gravadas</Text>
                    </View>
                    {cuerpoDocumento.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.numItem}</Text>
                            <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.cantidad}</Text>
                            <Text style={[styles.tableCell, { flex: 0.8 }]}>UNIDAD</Text>
                            <Text style={[styles.tableCellDescription, { flex: 2 }]}>{item.descripcion}</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.precioUni, 3)}</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.montoDescu, 3)}</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.ventaNoSuj)}</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>-</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.ventaExenta)}</Text>
                            <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.ventaGravada)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totales */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsTable}>
                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>SUMA DE VENTAS:</Text>
                            <Text>{formatCurrency(resumen.subTotalVentas)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Suma Total de Operaciones:</Text>
                            <Text>{formatCurrency(resumen.montoTotalOperacion)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Desc. a ventas no sujetas:</Text>
                            <Text>{formatCurrency(resumen.descuNoSuj)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Desc. a ventas Exentas:</Text>
                            <Text>{formatCurrency(resumen.descuExenta)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Desc. a ventas Gravadas:</Text>
                            <Text>{formatCurrency(resumen.descuGravada)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>IVA 13%:</Text>
                            <Text>
                                {formatCurrency(
                                    resumen.totalIva !== undefined
                                        ? resumen.totalIva
                                        : Array.isArray(resumen.tributos) && resumen.tributos[0]?.valor !== undefined
                                          ? resumen.tributos[0].valor
                                          : 0,
                                )}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>Sub-Total:</Text>
                            <Text>{formatCurrency(resumen.subTotal)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>IVA Percibido:</Text>
                            <Text>{formatCurrency(resumen.ivaPerci1 || 0)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>IVA Retenido:</Text>
                            <Text>{formatCurrency(resumen.ivaRete1 || 0)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Retención Renta:</Text>
                            <Text>{formatCurrency(resumen.reteRenta || 0)}</Text>
                        </View>
                        <View style={styles.totalRowBold}>
                            <Text style={styles.bold}>Monto Total de la Operación:</Text>
                            <Text style={styles.bold}>{formatCurrency(resumen.montoTotalOperacion)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Total Otros montos no afectos:</Text>
                            <Text>{formatCurrency(resumen.totalNoGravado || 0)}</Text>
                        </View>
                        <View style={styles.totalRowBold}>
                            <Text style={styles.bold}>Total a Pagar:</Text>
                            <Text style={styles.bold}>{formatCurrency(resumen.total || resumen.montoTotalOperacion)}</Text>
                        </View>
                    </View>
                </View>

                {/* Información adicional */}
                <View style={styles.additionalInfo}>
                    <View style={styles.infoGrid}>
                        <Text>
                            <Text style={styles.bold}>Valor en Letras:</Text> {resumen.totalLetras}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Condición de la Operación:</Text> {resumen.condicionOperacion === 1 ? 'Contado' : 'Crédito'}
                        </Text>
                    </View>
                    <View style={styles.fieldRow}>
                        <Text>
                            <Text style={styles.bold}>Observaciones:</Text> ___
                        </Text>
                    </View>
                </View>

                {/* Responsables */}
                <View style={styles.responsibleSection}>
                    <View style={styles.responsibleBox}>
                        <Text>
                            <Text style={styles.bold}>Responsable por parte del emisor:</Text> {emisor.nombre}
                        </Text>
                    </View>
                    <View style={styles.responsibleBox}>
                        <Text>
                            <Text style={styles.bold}>N° de Documento:</Text> {emisor.nit}
                        </Text>
                    </View>
                </View>
                <View style={styles.responsibleSection}>
                    <View style={styles.responsibleBox}>
                        <Text>
                            <Text style={styles.bold}>Responsable por parte del Receptor:</Text> {receptor.nombre}
                        </Text>
                    </View>
                    <View style={styles.responsibleBox}>
                        <Text>
                            <Text style={styles.bold}>N° de Documento:</Text> {receptor.nit}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>Página 1 de 1</Text>
            </Page>
        </Document>
    );
}
