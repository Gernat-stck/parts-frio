import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TABLE_HEADERS_ADMIN, TABLE_HEADERS_EMPLOYEES } from '@/constants/employeeConstants';
import { Employee } from '@/types/employee';
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
    itemsPerPage = 5,
    isAdmin = false,
    selectedDepartments = [],
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedEmployees, setPaginatedEmployees] = useState<Employee[]>([]);

    const handlePaginatedData = useCallback((data: Employee[]) => {
        setPaginatedEmployees(data);
    }, []);
    const TABLE_HEADERS = isAdmin ? TABLE_HEADERS_ADMIN : TABLE_HEADERS_EMPLOYEES;
    return (
        <div className="space-y-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {isAdmin ? 'Lista de Empleados' : 'Directorio de Contactos'}
                    </CardTitle>
                    <CardDescription>
                        Total de empleados: {totalEmployees} | Activos: {activeEmployeesCount}
                        {selectedDepartments.length > 0 && <span className="ml-2">• Filtrado por: {selectedDepartments.join(', ')}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
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
                </CardContent>
            </Card>

            {/* Paginación */}
            <Pagination
                data={employees}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPaginatedData={handlePaginatedData}
                pageInfo={{
                    itemName: 'empleados',
                }}
                maxPageButtons={5}
            />
        </div>
    );
};
