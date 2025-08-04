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
    onClearFilters?: () => void;
}
export default function FilterAndSearch({ busqueda, setBusqueda, filtroEstado, setFiltroEstado, onClearFilters }: FilterAndSearchProps) {
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
                            <SelectItem value="certificada">Certificada</SelectItem>
                            <SelectItem value="contingencia">Contingencia</SelectItem>
                            <SelectItem value="anulada">Anulada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Botón limpiar */}
                <Button
                    variant="outline"
                    className="w-full flex-shrink-0 sm:w-auto"
                    onClick={() => {
                        if (onClearFilters) {
                            onClearFilters();
                        } else {
                            setBusqueda('');
                            setFiltroEstado('todos');
                        }
                    }}
                >
                    Limpiar
                </Button>
            </CardContent>
        </Card>
    );
}
