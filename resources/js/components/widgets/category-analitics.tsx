import { ProductCategory } from '@/types/widgets';
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
                        <RadarChart data={CategoryAnalitics}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis angle={90} domain={[0, 50]} />
                            <Radar name="Ventas %" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                            {/* <RechartTooltip /> */}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
