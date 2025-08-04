import type { TopClientsData } from '@/types/widgets';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function TrendingClients({ topClientsData }: { topClientsData: TopClientsData[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="dark:text-accent">Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topClientsData.map((cliente, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium dark:text-accent">{cliente.cliente}</span>
                                <div className="text-right">
                                    <span className="font-bold dark:text-accent">${cliente.cantidad.toLocaleString()}</span>
                                    <span className="ml-2 text-sm text-gray-600">({cliente.porcentaje}%)</span>
                                </div>
                            </div>
                            <div className="h-3 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                                    style={{ width: `${Math.min(cliente.porcentaje, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
