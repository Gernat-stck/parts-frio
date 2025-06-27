import { Building, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';

interface UsersFilterProps {
    departments: string[];
    selectedDepartments: string[];
    setSelectedDepartments: (departments: string[]) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function UsersFilter({
    departments = [],
    selectedDepartments = [],
    setSelectedDepartments = () => {},
    searchTerm = '',
    setSearchTerm = () => {},
}: UsersFilterProps) {
    const handleDepartmentFilter = (department: string) => {
        if (selectedDepartments.includes(department)) {
            setSelectedDepartments(selectedDepartments.filter(d => d !== department));
        } else {
            setSelectedDepartments([...selectedDepartments, department]);
        }
    };

    const clearFilters = () => {
        setSelectedDepartments([]);
        setSearchTerm('');
    };

    return (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
                <Input
                    placeholder="Buscar por nombre, email o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <Filter className="h-4 w-4" />
                            Departamentos
                            {selectedDepartments.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {selectedDepartments.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {departments.map((department) => (
                            <DropdownMenuCheckboxItem
                                key={department}
                                checked={selectedDepartments.includes(department)}
                                onCheckedChange={() => handleDepartmentFilter(department)}
                            >
                                <Building className="mr-2 h-4 w-4" />
                                {department}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {(selectedDepartments.length > 0 || searchTerm) && (
                    <Button variant="ghost" onClick={clearFilters} className="gap-2">
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
