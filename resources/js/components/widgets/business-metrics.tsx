import { DollarSign, ShoppingCart, Target } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function BusinessMetrics() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Ganancia Neta</p>
                            <p className="text-3xl font-bold">$137,260</p>
                            <p className="text-sm text-green-100">+18.2% vs mes anterior</p>
                        </div>
                        <DollarSign className="h-12 w-12 text-green-200" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Conversión</p>
                            <p className="text-3xl font-bold">24.8%</p>
                            <p className="text-sm text-blue-100">+2.1% vs mes anterior</p>
                        </div>
                        <Target className="h-12 w-12 text-blue-200" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Ticket Promedio</p>
                            <p className="text-3xl font-bold">$492</p>
                            <p className="text-sm text-purple-100">+5.7% vs mes anterior</p>
                        </div>
                        <ShoppingCart className="h-12 w-12 text-purple-200" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
