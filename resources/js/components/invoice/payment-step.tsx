import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAYMENTS_METHODS as formasPago } from '@/constants/salesConstants';
import type { CartItem, Payment } from '@/types/invoice';
interface PaymentStepProps {
    data: Payment;
    setData: (data: Payment) => void;
    cartItems: CartItem[];
    onNext: () => void;
    onPrev: () => void;
}

export default function PaymentStep({ data, setData, cartItems, onNext, onPrev }: PaymentStepProps) {
    const calculateTotal = () => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.quantity * item.price - (item.montoDescu || 0));
        }, 0);
        return subtotal;
    };

    const total = calculateTotal();

    const updatePaymentMethod = (codigo: string) => {
        setData({
            ...data,
            pagos: [
                {
                    codigo,
                    montoPago: Number(total.toFixed(2)),
                    referencia: data.pagos[0]?.referencia || '',
                    periodo: null,
                    plazo: null,
                },
            ],
        });
    };

    const updateReference = (referencia: string) => {
        setData({
            ...data,
            pagos: [
                {
                    ...data.pagos[0],
                    referencia,
                },
            ],
        });
    };

    const updateCondition = (condicion: string) => {
        setData({
            ...data,
            condicionOperacion: Number.parseInt(condicion),
        });
    };

    return (
        <div className="space-y-4 p-2 sm:space-y-6 sm:p-4">
            <Card className="border-0">
                <CardHeader className="px-0 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0 sm:space-y-6 sm:px-6">
                    <div className="rounded-lg p-3 sm:p-4 ">
                        <div className="text-xl font-bold  sm:text-2xl ">Total a Pagar: ${total.toFixed(2)}</div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-semibold sm:text-base">Condición de Operación</Label>
                        <RadioGroup
                            value={data.condicionOperacion.toString()}
                            onValueChange={updateCondition}
                            className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
                        >
                            <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4">
                                <RadioGroupItem value="1" id="contado" />
                                <Label htmlFor="contado" className="cursor-pointer">
                                    <div className="text-sm font-medium sm:text-base">Contado</div>
                                    <div className="text-xs text-gray-500 sm:text-sm">Pago inmediato</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4">
                                <RadioGroupItem value="2" id="credito" />
                                <Label htmlFor="credito" className="cursor-pointer">
                                    <div className="text-sm font-medium sm:text-base">Crédito</div>
                                    <div className="text-xs text-gray-500 sm:text-sm">Pago a plazo</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4">
                                <RadioGroupItem value="3" id="consignacion" />
                                <Label htmlFor="consignacion" className="cursor-pointer">
                                    <div className="text-sm font-medium sm:text-base">Consignación</div>
                                    <div className="text-xs text-gray-500 sm:text-sm">Pago por consignación</div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-semibold sm:text-base">Forma de Pago</Label>
                        <Select value={data.pagos[0]?.codigo} onValueChange={updatePaymentMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar forma de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                {formasPago.map((forma) => (
                                    <SelectItem key={forma.value} value={forma.value}>
                                        {forma.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {data.pagos[0]?.codigo && data.pagos[0].codigo !== '01' && (
                        <div className="space-y-2">
                            <Label htmlFor="referencia" className="text-sm font-medium">
                                Referencia de Pago
                            </Label>
                            <Input
                                id="referencia"
                                value={data.pagos[0]?.referencia || ''}
                                onChange={(e) => updateReference(e.target.value)}
                                placeholder="Número de transacción, cheque, etc."
                            />
                        </div>
                    )}

                    <div className="rounded-lg p-3 sm:p-4 ">
                        <h3 className="mb-2 text-sm font-semibold sm:text-base">Resumen del Pago</h3>
                        <div className="space-y-1 text-xs sm:text-sm">
                            <div className="flex justify-between">
                                <span>Forma de pago:</span>
                                <span className="text-right">
                                    {formasPago.find((f) => f.value === data.pagos[0]?.codigo)?.label || 'No seleccionado'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monto:</span>
                                <span>${total.toFixed(2) || data.pagos[0]?.montoPago?.toFixed(2)}</span>
                            </div>
                            {data.pagos[0]?.referencia && (
                                <div className="flex justify-between">
                                    <span>Referencia:</span>
                                    <span className="text-right break-all">{data.pagos[0].referencia}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={onPrev} className="w-full bg-transparent sm:w-auto">
                    Volver a Datos del Cliente
                </Button>
                <Button onClick={onNext} disabled={!data.pagos[0]?.codigo} className="w-full sm:w-auto">
                    Generar Factura
                </Button>
            </div>
        </div>
    );
}
