import type { MonthlyTrendData } from '@/types/widgets';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function SalesTrend({ monthlyTrendData }: { monthlyTrendData: MonthlyTrendData[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="dark:text-accent">Tendencia de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                            <Line type="monotone" dataKey="tendencia" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="objetivo" stroke="#f59e0b" strokeWidth={2} strokeDasharray="10 5" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-blue-500"></div>
                            <span className="text-sm text-gray-600">Ventas</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">$52,000</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-green-500" style={{ borderStyle: 'dashed' }}></div>
                            <span className="text-sm text-gray-600">Tendencia</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">$49,000</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-yellow-500" style={{ borderStyle: 'dashed' }}></div>
                            <span className="text-sm text-gray-600">Objetivo</span>
                        </div>
                        <p className="text-lg font-bold text-yellow-600">$50,000</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
