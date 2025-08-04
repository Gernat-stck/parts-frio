import type { ProductCategory } from '@/types/widgets';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function CategoryAnaliticsWidget({ CategoryAnalitics }: { CategoryAnalitics: ProductCategory[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Análisis de Categorías</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={CategoryAnalitics} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis angle={90} domain={[0, 50]} />
                            <Radar name="Ventas %" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    {CategoryAnalitics.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                <span className="font-medium">{cat.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold">{cat.value}%</span>
                                <span className="ml-2 text-sm text-gray-600">({cat.productos} productos)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
