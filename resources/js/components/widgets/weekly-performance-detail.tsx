import { WeeklyPerformanceData } from '@/types/widgets';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function WeeklyPerformanceDetail({ weeklyPerformanceData }: { weeklyPerformanceData: WeeklyPerformanceData[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Rendimiento Semanal Detallado</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="periodo" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            {/* <RechartTooltip
                                formatter={(value: any, name) => [
                                    name === 'facturas' || name === 'clientes' ? value : `$${Number(value).toLocaleString()}`,
                                    name === 'ventas'
                                        ? 'Ventas'
                                        : name === 'gastos'
                                          ? 'Gastos'
                                          : name === 'ganancia'
                                            ? 'Ganancia'
                                            : name === 'facturas'
                                              ? 'Facturas'
                                              : 'Clientes',
                                ]}
                            /> */}
                            <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
