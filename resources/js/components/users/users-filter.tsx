import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Building, Filter, Search, X } from 'lucide-react';

interface UsersFilterProps {
    departments: string[];
    selectedDepartments: string[];
    setSelectedDepartments: (departments: string[]) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function UsersFilter({
    departments = [],
    selectedDepartments = [],
    setSelectedDepartments = () => {},
    searchTerm = '',
    setSearchTerm = () => {},
}: UsersFilterProps) {
    const handleDepartmentFilter = (department: string) => {
        if (selectedDepartments.includes(department)) {
            setSelectedDepartments(selectedDepartments.filter((d) => d !== department));
        } else {
            setSelectedDepartments([...selectedDepartments, department]);
        }
    };

    const clearFilters = () => {
        setSelectedDepartments([]);
        setSearchTerm('');
    };

    const hasActiveFilters = selectedDepartments.length > 0 || searchTerm;

    return (
        <Card className="border-0 shadow-md">
            <CardContent className="p-2">
                {/* Single Row Layout */}
                <div className="flex gap-3">
                    {/* Search Input - 3/4 width */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, email o cargo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 bg-muted/50 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-base"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform p-0 hover:bg-muted"
                                onClick={() => setSearchTerm('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    {/* Department Filter - 1/4 width */}
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-muted-foreground/20 bg-background whitespace-nowrap hover:bg-muted/50"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden sm:inline">Departamentos</span>
                                    <span className="sm:hidden">Dept.</span>
                                    {selectedDepartments.length > 0 && (
                                        <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {selectedDepartments.length}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                {/* Two Column Layout */}
                                <div className="grid grid-cols-1 gap-1 p-1">
                                    {departments.map((department) => (
                                        <DropdownMenuCheckboxItem
                                            key={department}
                                            checked={selectedDepartments.includes(department)}
                                            onCheckedChange={() => handleDepartmentFilter(department)}
                                            className="text-xs"
                                        >
                                            <Building className="mr-2 h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{department}</span>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Clear Filters Button - Only show when filters are active */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="gap-2 text-sm whitespace-nowrap hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                            >
                                <X className="h-4 w-4" />
                                <span className="hidden sm:inline">Limpiar</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
