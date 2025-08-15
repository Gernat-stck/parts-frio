import { Filter, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterAndSearchProps {
    busqueda: string;
    setBusqueda: (value: string) => void;
    filtroEstado: string;
    setFiltroEstado: (value: string) => void;
    mes: string;
    setMes: (value: string) => void;
    anio: string;
    setAnio: (value: string) => void;
    onClearFilters?: () => void;
}

const meses = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

export default function FilterAndSearch({
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    onClearFilters,
    mes,
    setMes,
    anio,
    setAnio,
}: FilterAndSearchProps) {
    // Generar años dinámicamente, por ejemplo, los últimos 5 años
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <Card>
            <CardContent className="flex flex-wrap items-center gap-4 md:justify-between">
                {/* Título */}
                <div className="flex shrink-0 items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros y Búsqueda</span>
                </div>

                {/* Buscador */}
                <div className="relative w-full min-w-[200px] flex-1 sm:max-w-sm">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por receptor, documento o código..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Select Estado */}
                <div className="w-full min-w-[160px] flex-1 sm:w-auto">
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="PROCESADO">Certificada</SelectItem>
                            <SelectItem value="CONTINGENCIA">Contingencia</SelectItem>
                            <SelectItem value="ANULADO">Anulada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Select Mes */}
                <div className="w-full min-w-[120px] flex-1 sm:w-auto">
                    <Select value={mes} onValueChange={setMes}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            {meses.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Año */}
                <div className="w-full min-w-[120px] flex-1 sm:w-auto">
                    <Select value={anio} onValueChange={setAnio}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Botón limpiar */}
                <Button
                    variant="outline"
                    className="w-full flex-shrink-0 sm:w-auto"
                    onClick={() => {
                        setBusqueda('');
                        setFiltroEstado('todos');
                        setMes(String(new Date().getMonth() + 1).padStart(2, '0'));
                        setAnio(String(new Date().getFullYear()));
                        if (onClearFilters) {
                            onClearFilters();
                        }
                    }}
                >
                    Limpiar
                </Button>
            </CardContent>
        </Card>
    );
}
