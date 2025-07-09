import { MonthlyTrendData } from '@/types/widgets';
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function SalesTrend({ monthlyTrendData }: { monthlyTrendData: MonthlyTrendData[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            {/* <RechartTooltip
                                formatter={(value: unknown, name) => [
                                    `$${Number(value).toLocaleString()}`,
                                    name === 'ventas' ? 'Ventas' : name === 'tendencia' ? 'Tendencia' : 'Objetivo',
                                ]}
                            /> */}
                            <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                            <Line type="monotone" dataKey="tendencia" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="objetivo" stroke="#f59e0b" strokeWidth={2} strokeDasharray="10 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
