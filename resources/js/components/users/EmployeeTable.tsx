import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TABLE_HEADERS_ADMIN, TABLE_HEADERS_EMPLOYEES } from '@/constants/employeeConstants';
// import { useIsMobile } from '@/hooks/use-mobile';
import type { Employee } from '@/types/employee';
import { Users } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { EmployeeTableRow } from './EmployeeTableRow';

interface EmployeeTableProps {
    employees: Employee[];
    totalEmployees: number;
    activeEmployeesCount: number;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    itemsPerPage?: number;
    isAdmin?: boolean;
    selectedDepartments?: string[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
    employees,
    totalEmployees,
    activeEmployeesCount,
    onEdit,
    onDelete,
    itemsPerPage = 3,
    isAdmin = false,
    selectedDepartments = [],
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedEmployees, setPaginatedEmployees] = useState<Employee[]>([]);
    // const isMobile = useIsMobile();

    const handlePaginatedData = useCallback((data: Employee[]) => {
        setPaginatedEmployees(data);
    }, []);

    const TABLE_HEADERS = isAdmin ? TABLE_HEADERS_ADMIN : TABLE_HEADERS_EMPLOYEES;

    return (
        <div>
            <Card className='border-none'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                        {isAdmin ? 'Lista de Empleados' : 'Directorio de Contactos'}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                            <span>Total de empleados: {totalEmployees}</span>
                            <span>Activos: {activeEmployeesCount}</span>
                            {selectedDepartments.length > 0 && (
                                <span className="text-xs sm:text-sm">Filtrado por: {selectedDepartments.join(', ')}</span>
                            )}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {TABLE_HEADERS.map((header) => (
                                            <TableHead key={header} className={header === 'Acciones' ? 'text-right' : ''}>
                                                {header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedEmployees.length > 0 ? (
                                        paginatedEmployees.map((employee) => (
                                            <EmployeeTableRow
                                                key={employee.id}
                                                employee={employee}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                isAdmin={isAdmin}
                                                isMobile={false}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <td colSpan={TABLE_HEADERS.length} className="py-8 text-center text-muted-foreground">
                                                No se encontraron empleados
                                            </td>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden">
                        {paginatedEmployees.length > 0 ? (
                            <div className="space-y-3">
                                {paginatedEmployees.map((employee) => (
                                    <EmployeeTableRow
                                        key={employee.id}
                                        employee={employee}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        isAdmin={isAdmin}
                                        isMobile={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                    <p className="text-sm sm:text-base">No se encontraron empleados</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Paginación */}
            <div className="flex justify-center">
                <Pagination
                    data={employees}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPaginatedData={handlePaginatedData}
                    pageInfo={{
                        itemName: 'empleados',
                    }}
                    maxPageButtons={3} // Reduced for mobile
                />
            </div>
        </div>
    );
};
