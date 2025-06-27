import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Employee } from '@/types/employee';
import { calculateYearsWorking, formatDate } from '@/utils/employeeUtils';
import { Calendar, Edit, Mail, MoreHorizontal, Phone, Trash2 } from 'lucide-react';
import type React from 'react';

interface EmployeeTableRowProps {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    isAdmin?: boolean; // Prop to determine if the user is an admin
}

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ employee, onEdit, onDelete, isAdmin }) => {
    const handleEdit = () => onEdit(employee);
    const handleDelete = () => onDelete(employee.id);
    const getDepartmentColor = (department: string) => {
        const colors: Record<string, string> = {
            IT: 'bg-blue-100 text-blue-800',
            'Recursos Humanos': 'bg-green-100 text-green-800',
            Marketing: 'bg-purple-100 text-purple-800',
            Ventas: 'bg-orange-100 text-orange-800',
            Finanzas: 'bg-yellow-100 text-yellow-800',
            Operaciones: 'bg-gray-100 text-gray-800',
        };
        return colors[department] || 'bg-gray-100 text-gray-800';
    };
    return (
        <TableRow>
            <TableCell>
                <div className="space-y-1">
                    <div className="font-medium">{employee.name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {employee.phone}
                </div>
            </TableCell>
            <TableCell>
                <div className="font-medium">{employee.position}</div>
            </TableCell>
            <TableCell>
                <Badge className={getDepartmentColor(employee.department)} variant="secondary">
                    {employee.department}
                </Badge>
            </TableCell>
            {isAdmin && (
                <TableCell>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(employee.startDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">{calculateYearsWorking(employee.startDate)} años trabajando</div>
                    </div>
                </TableCell>
            )}
            {isAdmin && (
                <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                </TableCell>
            )}
            {isAdmin && (
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
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
};
