import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { historicalSalesData, kpiData, monthlyTrendData, productCategoryData, topClientsData, weeklyPerformanceData } from '@/data/mock-data';
import { Award } from 'lucide-react';
// import { useState } from 'react';
import BusinessMetrics from './business-metrics';
import CategoryAnaliticsWidget from './category-analitics';
import DistributionCategory from './distribution-category';
import KPIWidget from './kpi-widgets';
import PurchaseGraph from './purchase-graph';
import SalesTrend from './sales-trend';
import TrendingClients from './trending-clients';
import WeeklyPerformanceDetail from './weekly-performance-detail';

// Versión 3: Dashboard Moderno con Métricas Avanzadas
export default function DashboardV3() {
    //const [selectedPeriod, setSelectedPeriod] = useState('month');

    return (
        <div>
            <div className="p-6">
                {/* KPIs con diseño moderno */}
                <KPIWidget kpiData={kpiData} />
                {/* Tabs para diferentes vistas */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                        <TabsTrigger value="overview" className="dark:text-accent">
                            Vista General
                        </TabsTrigger>
                        <TabsTrigger value="sales" className="dark:text-accent">
                            Ventas
                        </TabsTrigger>
                        <TabsTrigger value="products" className="dark:text-accent">
                            Productos
                        </TabsTrigger>
                        <TabsTrigger value="team" className="dark:text-accent">
                            Equipo
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Gráfico de ventas vs gastos */}
                            <PurchaseGraph historicalSalesData={historicalSalesData} />

                            {/* Distribución por categorías */}
                            <DistributionCategory productCategoryData={productCategoryData} />
                        </div>

                        {/* Métricas adicionales */}
                        <BusinessMetrics />
                    </TabsContent>

                    <TabsContent value="sales" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <SalesTrend monthlyTrendData={monthlyTrendData} />
                            <TrendingClients topClientsData={topClientsData} />
                        </div>

                        <WeeklyPerformanceDetail weeklyPerformanceData={weeklyPerformanceData} />
                    </TabsContent>

                    <TabsContent value="products" className="space-y-6">
                        <CategoryAnaliticsWidget CategoryAnalitics={productCategoryData} />
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        <div className="py-12 text-center">
                            <Award className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">Gestión de Equipo</h3>
                            <p className="text-gray-600">Métricas detalladas del equipo próximamente</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
