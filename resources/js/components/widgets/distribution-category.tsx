import { ProductCategory } from '@/types/widgets';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function DistributionCategory({ productCategoryData }: { productCategoryData: ProductCategory[] }) {
    return (
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:text-accent">
            <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={productCategoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={5} dataKey="value">
                                {productCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            {/* <RechartTooltip formatter={(value, name) => [`${value}%`, name]} /> */}
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                    {productCategoryData.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="font-medium">{cat.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">${cat.ventas.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">{cat.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
