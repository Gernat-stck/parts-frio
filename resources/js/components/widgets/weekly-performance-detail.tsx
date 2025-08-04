import type { WeeklyPerformanceData } from '@/types/widgets';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function WeeklyPerformanceDetail({ weeklyPerformanceData }: { weeklyPerformanceData: WeeklyPerformanceData[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="dark:text-accent">Rendimiento Semanal Detallado</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="periodo" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-gray-600">Ventas</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">$16,330</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-600">Gastos</span>
                        </div>
                        <p className="text-lg font-bold text-red-600">$5,100</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 flex items-center justify-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">Ganancia</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">$11,230</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
