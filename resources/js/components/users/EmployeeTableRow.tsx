import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Employee } from '@/types/employee';
import { calculateYearsWorking, formatDate } from '@/utils/employeeUtils';
import { Calendar, Edit, Mail, MoreHorizontal, Phone, Trash2, User } from 'lucide-react';

interface EmployeeTableRowProps {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    isAdmin?: boolean;
    isMobile?: boolean;
}

export function EmployeeTableRow({ employee, onEdit, onDelete, isAdmin, isMobile = false }: EmployeeTableRowProps) {
    const handleEdit = () => onEdit(employee);
    const handleDelete = () => onDelete(employee.id);

    const getDepartmentColor = (department: string) => {
        const colors: Record<string, string> = {
            IT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Recursos Humanos': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            Marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            Ventas: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            Finanzas: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            Operaciones: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[department] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    // Mobile Card View
    if (isMobile) {
        return (
            <Card className="border-0 bg-gradient-to-r from-white to-slate-50 shadow-sm transition-all duration-200 hover:shadow-md dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold break-words text-foreground">{employee.name}</div>
                                        <div className="text-xs break-all text-muted-foreground">{employee.position}</div>
                                    </div>
                                </div>
                            </div>
                            {isAdmin && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleEdit} className="gap-2">
                                            <Edit className="h-4 w-4" />
                                            Editar empleado
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar empleado
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 pl-10">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 flex-shrink-0 text-blue-500" />
                                <span className="text-xs break-all text-muted-foreground">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 flex-shrink-0 text-green-500" />
                                <span className="text-xs text-muted-foreground">{employee.phone}</span>
                            </div>
                        </div>

                        {/* Department and Status */}
                        <div className="flex flex-wrap gap-2 pl-10">
                            <Badge className={`${getDepartmentColor(employee.department)} text-xs font-medium`} variant="secondary">
                                {employee.department}
                            </Badge>
                            {isAdmin && (
                                <Badge
                                    variant={employee.status === 'active' ? 'default' : 'secondary'}
                                    className={`text-xs ${
                                        employee.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}
                                >
                                    {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                                </Badge>
                            )}
                        </div>

                        {/* Admin Info */}
                        {isAdmin && (
                            <div className="border-t pt-2 pl-10">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3 flex-shrink-0 text-purple-500" />
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Inicio: </span>
                                        <span className="font-medium">{formatDate(employee.startDate)}</span>
                                        <span className="ml-2 text-muted-foreground">({calculateYearsWorking(employee.startDate)} años)</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Desktop Table Row
    return (
        <TableRow className="transition-colors hover:bg-muted/30">
            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="font-medium">{employee.name}</div>
                    </div>
                    <div className="ml-10 flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 text-blue-500" />
                        <span className="break-all">{employee.email}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-green-500" />
                    {employee.phone}
                </div>
            </TableCell>
            <TableCell>
                <div className="font-medium break-words">{employee.position}</div>
            </TableCell>
            <TableCell>
                <Badge className={`${getDepartmentColor(employee.department)} font-medium`} variant="secondary">
                    {employee.department}
                </Badge>
            </TableCell>
            {isAdmin && (
                <TableCell>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-purple-500" />
                            {formatDate(employee.startDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">{calculateYearsWorking(employee.startDate)} años trabajando</div>
                    </div>
                </TableCell>
            )}
            {isAdmin && (
                <TableCell>
                    <Badge
                        variant={employee.status === 'active' ? 'default' : 'secondary'}
                        className={
                            employee.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }
                    >
                        {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                </TableCell>
            )}
            {isAdmin && (
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Editar empleado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Eliminar empleado
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            )}
        </TableRow>
    );
}
