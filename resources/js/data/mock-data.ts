import { FinancialStats, MonthlySalesRecord, MonthlyTrendData, ProductCategory, TopClientsData, WeeklyPerformanceData } from '../types/widgets';

// Datos históricos completos para el dashboard
export const historicalSalesData: MonthlySalesRecord[] = [
    { mes: 'Ene', ventas: 32000, facturas: 85, clientes: 45, gastos: 18000, ganancia: 14000 },
    { mes: 'Feb', ventas: 41000, facturas: 102, clientes: 52, gastos: 22000, ganancia: 19000 },
    { mes: 'Mar', ventas: 35000, facturas: 93, clientes: 48, gastos: 19000, ganancia: 16000 },
    { mes: 'Abr', ventas: 48000, facturas: 118, clientes: 65, gastos: 25000, ganancia: 23000 },
    { mes: 'May', ventas: 45230, facturas: 127, clientes: 89, gastos: 24000, ganancia: 21230 },
    { mes: 'Jun', ventas: 52000, facturas: 135, clientes: 95, gastos: 26000, ganancia: 26000 },
];

export const weeklyPerformanceData: WeeklyPerformanceData[] = [
    { periodo: 'Sem 1', ventas: 8200, gastos: 3200, ganancia: 5000, facturas: 22, clientes: 18 },
    { periodo: 'Sem 2', ventas: 9500, gastos: 3800, ganancia: 5700, facturas: 28, clientes: 21 },
    { periodo: 'Sem 3', ventas: 11200, gastos: 4200, ganancia: 7000, facturas: 32, clientes: 25 },
    { periodo: 'Sem 4', ventas: 16330, gastos: 5100, ganancia: 11230, facturas: 45, clientes: 35 },
];

export const dailyTrendData = [
    { dia: 'Lun', ventas: 2800, visitas: 450, conversiones: 28 },
    { dia: 'Mar', ventas: 3200, visitas: 520, conversiones: 32 },
    { dia: 'Mié', ventas: 2900, visitas: 480, conversiones: 29 },
    { dia: 'Jue', ventas: 3800, visitas: 620, conversiones: 38 },
    { dia: 'Vie', ventas: 4200, visitas: 680, conversiones: 42 },
    { dia: 'Sáb', ventas: 2100, visitas: 320, conversiones: 21 },
    { dia: 'Dom', ventas: 1800, visitas: 280, conversiones: 18 },
];

export const productCategoryData: ProductCategory[] = [
    { name: 'Electrónicos', value: 45, color: '#3b82f6', ventas: 125000, productos: 89 },
    { name: 'Oficina', value: 30, color: '#10b981', ventas: 85000, productos: 156 },
    { name: 'Accesorios', value: 25, color: '#f59e0b', ventas: 65000, productos: 234 },
];

export const customerSegmentData = [
    { name: 'Empresas', value: 45, color: '#3b82f6', ingresos: 180000, cantidad: 34 },
    { name: 'Personas', value: 32, color: '#10b981', ingresos: 95000, cantidad: 89 },
    { name: 'Gobierno', value: 23, color: '#f59e0b', ingresos: 125000, cantidad: 12 },
];

export const topProductsData = [
    { nombre: 'Laptop Dell XPS 13', ventas: 15, ingresos: 18000, stock: 12, categoria: 'Electrónicos' },
    { nombre: 'Monitor Samsung 27"', ventas: 12, ingresos: 4200, stock: 8, categoria: 'Electrónicos' },
    { nombre: 'Teclado Mecánico RGB', ventas: 25, ingresos: 3000, stock: 45, categoria: 'Accesorios' },
    { nombre: 'Mouse Inalámbrico Pro', ventas: 18, ingresos: 810, stock: 23, categoria: 'Accesorios' },
    { nombre: 'Webcam HD 1080p', ventas: 22, ingresos: 2090, stock: 15, categoria: 'Electrónicos' },
    { nombre: 'Silla Ergonómica', ventas: 8, ingresos: 3200, stock: 6, categoria: 'Oficina' },
];

export const salesTeamData = [
    { nombre: 'Ana García', ventas: 23, meta: 25, comision: 2300, progreso: 92, region: 'Norte' },
    { nombre: 'Carlos López', ventas: 19, meta: 20, comision: 1900, progreso: 95, region: 'Sur' },
    { nombre: 'María Rodríguez', ventas: 28, meta: 25, comision: 2800, progreso: 112, region: 'Centro' },
    { nombre: 'Juan Pérez', ventas: 15, meta: 20, comision: 1500, progreso: 75, region: 'Este' },
    { nombre: 'Laura Martín', ventas: 21, meta: 22, comision: 2100, progreso: 95, region: 'Oeste' },
];

export const lowStockData = [
    { producto: 'Laptop HP Pavilion', stock: 2, minimo: 10, urgencia: 'crítica', categoria: 'Electrónicos' },
    { producto: 'Impresora Canon', stock: 1, minimo: 5, urgencia: 'crítica', categoria: 'Oficina' },
    { producto: 'Tablet Samsung', stock: 3, minimo: 8, urgencia: 'alta', categoria: 'Electrónicos' },
    { producto: 'Router TP-Link', stock: 4, minimo: 12, urgencia: 'media', categoria: 'Electrónicos' },
    { producto: 'Escritorio Ejecutivo', stock: 2, minimo: 6, urgencia: 'alta', categoria: 'Oficina' },
];

export const recentSalesData = [
    { factura: 'F-001', cliente: 'Empresa ABC', monto: 1250, estado: 'Pagada', fecha: 'Hoy', vendedor: 'Ana García' },
    {
        factura: 'F-002',
        cliente: 'Comercial XYZ',
        monto: 890,
        estado: 'Pendiente',
        fecha: 'Hoy',
        vendedor: 'Carlos López',
    },
    {
        factura: 'F-003',
        cliente: 'Retail Store',
        monto: 2100,
        estado: 'Pagada',
        fecha: 'Ayer',
        vendedor: 'María Rodríguez',
    },
    {
        factura: 'F-004',
        cliente: 'Tech Solutions',
        monto: 1580,
        estado: 'Pendiente',
        fecha: 'Ayer',
        vendedor: 'Juan Pérez',
    },
    {
        factura: 'F-005',
        cliente: 'Global Corp',
        monto: 3200,
        estado: 'Pagada',
        fecha: '2 días',
        vendedor: 'Laura Martín',
    },
];

export const monthlyTrendData: MonthlyTrendData[] = [
    { mes: 'Ene', ventas: 32000, tendencia: 28000, objetivo: 35000 },
    { mes: 'Feb', ventas: 41000, tendencia: 35000, objetivo: 38000 },
    { mes: 'Mar', ventas: 35000, tendencia: 38000, objetivo: 40000 },
    { mes: 'Abr', ventas: 48000, tendencia: 42000, objetivo: 45000 },
    { mes: 'May', ventas: 45230, tendencia: 46000, objetivo: 48000 },
    { mes: 'Jun', ventas: 52000, tendencia: 49000, objetivo: 50000 },
];

export const kpiData: FinancialStats[] = [
    {
        title: 'Ingresos Totales',
        value: '$275,460',
        change: 12.5,
        icon: 'DollarSign',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        trend: 'up',
        period: 'vs mes anterior',
    },
    {
        title: 'Facturas Emitidas',
        value: '560',
        change: 8.2,
        icon: 'ShoppingCart',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        trend: 'up',
        period: 'este mes',
    },
    {
        title: 'Clientes Activos',
        value: '314',
        change: 5.7,
        icon: 'Users',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        trend: 'up',
        period: 'total activos',
    },
    {
        title: 'Productos Stock',
        value: '1,234',
        change: -2.1,
        icon: 'Package',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        trend: 'down',
        period: 'en inventario',
    },
];

export const regionalSalesData = [
    { region: 'Norte', ventas: 85000, crecimiento: 15.2, vendedores: 8 },
    { region: 'Sur', ventas: 72000, crecimiento: 8.7, vendedores: 6 },
    { region: 'Centro', ventas: 95000, crecimiento: 22.1, vendedores: 10 },
    { region: 'Este', ventas: 68000, crecimiento: 5.3, vendedores: 5 },
    { region: 'Oeste', ventas: 78000, crecimiento: 12.8, vendedores: 7 },
];

export const topClientsData: TopClientsData[] = [
    { cliente: 'Paco Miguel', cantidad: 12500, porcentaje: 50 },
    { cliente: 'Maria Antonieta', cantidad: 3750, porcentaje: 30 },
    { cliente: 'Carlos Daniel', cantidad: 1125, porcentaje: 28 },
    { cliente: 'Victor Manuel', cantidad: 450, porcentaje: 19 },
    { cliente: 'Maritza Lopez', cantidad: 135, porcentaje: 15 },
];
