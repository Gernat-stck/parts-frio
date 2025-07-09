import { MonthlySalesRecord } from '@/types/widgets';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PurchaseGraphInterface {
    historicalSalesData: MonthlySalesRecord[];
}
export default function PurchaseGraph({ historicalSalesData }: PurchaseGraphInterface) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:text-accent">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Rendimiento Financiero
                    <Badge variant="outline" className='dark:text-accent'>Mensual</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalSalesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            {/* <RechartTooltip
                                    formatter={(value: unknown, name) => [
                                        `$${Number(value).toLocaleString()}`,
                                        name === 'ventas' ? 'Ventas' : name === 'gastos' ? 'Gastos' : 'Ganancia',
                                    ]}
                                /> */}
                            <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="ganancia" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
