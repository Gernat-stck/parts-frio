import type { MonthlySalesRecord } from '@/types/widgets';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PurchaseGraphInterface {
    historicalSalesData: MonthlySalesRecord[];
}

export default function PurchaseGraph({ historicalSalesData }: PurchaseGraphInterface) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center justify-between dark:text-accent">
                    Rendimiento Financiero
                    <Badge variant="outline" className="dark:text-accent">
                        Mensual
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="ganancia" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-blue-500"></div>
                            <span className="text-sm text-gray-600">Ventas</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">$275,460</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-red-500"></div>
                            <span className="text-sm text-gray-600">Gastos</span>
                        </div>
                        <p className="text-lg font-bold text-red-600">$138,200</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded bg-green-500"></div>
                            <span className="text-sm text-gray-600">Ganancia</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">$137,260</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
