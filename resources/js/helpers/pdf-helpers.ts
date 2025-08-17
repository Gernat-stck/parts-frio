import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES');
};

export const formatCurrency = (amount: number, decimales?: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency:'USD',
        minimumFractionDigits: decimales || 2,
    }).format(amount);
};
