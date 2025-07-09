import { TopClientsData } from "@/types/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TrendingClients({topClientsData}: 
    {topClientsData: TopClientsData[]}
) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topClientsData.map((clientes, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{clientes.cliente}</span>
                                <div className="text-right">
                                    <span className="font-bold">{clientes.cantidad.toLocaleString()}</span>
                                    <span className="ml-2 text-sm text-gray-600">({clientes.porcentaje}%)</span>
                                </div>
                            </div>
                            <div className="h-3 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                                    style={{ width: `${clientes.porcentaje}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
