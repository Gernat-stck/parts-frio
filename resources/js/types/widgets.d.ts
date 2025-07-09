export interface FinancialStats {
    title: string; // Título principal del indicador
    value: string; // Valor monetario con formato (ej. "$275,460")
    change: number; // Variación porcentual (ej. 12.5)
    icon: string; // Nombre del icono (ej. "DollarSign")
    color: string; // Clase de color del texto (ej. "text-green-600")
    bgColor: string; // Clase de fondo (ej. "bg-green-100")
    trend: 'up' | 'down'; // Dirección de la tendencia
    period: string; // Periodo comparativo (ej. "vs mes anterior")
}

// HistoricalSalesData

export interface MonthlySalesRecord {
    mes: string; // Nombre corto del mes (ej. "Ene", "Feb", etc.)
    ventas: number; // Total en ventas del mes
    facturas: number; // Número de facturas emitidas
    clientes: number; // Número de clientes únicos
    gastos: number; // Total de egresos o costos en el mes
    ganancia: number; // Ganancia neta (ventas - gastos)
}

// CategoriaProducto
export interface ProductCategory {
    name: string; // Nombre de la categoría (ej. "Electrónicos")
    value: number; // Porcentaje de participación (ej. 45 para 45%)
    color: string; // Color hexadecimal asociado para visualización (ej. "#3b82f6")
    ventas: number; // Total de ventas en la categoría
    productos: number; // Número de productos ofrecidos en esta categoría
}

//MonthlyTrend
export interface MonthlyTrendData {
    mes: string;
    ventas: number;
    tendencia: number;
    objetivo: number;
}

//TopClientData
export interface TopClientsData {
    cliente: string;
    cantidad: number;
    porcentaje: number;
}

//WeeklyPerformanceData
export interface WeeklyPerformanceData {
    periodo: string,
    ventas: number, 
    gastos: number,
    ganancia: number,
    facturas: number,
    clientes: number
}

