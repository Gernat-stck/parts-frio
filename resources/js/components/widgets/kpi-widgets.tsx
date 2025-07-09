import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { FinancialStats } from "../../types/widgets";

export default function KPIWidget({ kpiData }: { kpiData: FinancialStats[] }) {
    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi, index) => {
                const IconComponent =
                    {
                        DollarSign,
                        ShoppingCart,
                        Users,
                        Package,
                    }[kpi.icon] || DollarSign;

                return (
                    <Card key={index} className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white">
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <div
                                    className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        kpi.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    {kpi.change > 0 ? '+' : ''}
                                    {kpi.change}%
                                </div>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-medium text-gray-600">{kpi.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
