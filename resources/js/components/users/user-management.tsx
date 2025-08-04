import type React from 'react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';
import { useEmployees } from '@/hooks/useEmployees';
import type { Employee } from '@/types/employee';
import { Plus } from 'lucide-react';
import type { Auth } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { EmployeeTable } from './EmployeeTable';
import { UsersFilter } from './users-filter';

interface UserManagementProps {
    auth: Auth;
    employee: Employee[];
}

export default function UserManagement({ auth, employee }: UserManagementProps) {
    const isAdmin: boolean = auth.user.role === 'admin' || auth.user.role === 'super-admin';
    const { addEmployee, updateEmployee, deleteEmployee, getTotalEmployees, getActiveEmployeesCount } = useEmployees({ employee });
    const { formData, editingEmployee, isDialogOpen, openDialog, closeDialog, updateField } = useEmployeeForm();

    // Estados para el filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    // Obtener departamentos únicos
    const departments = useMemo(() => {
        const uniqueDepartments = [...new Set(employee.map((emp) => emp.department).filter(Boolean))];
        return uniqueDepartments.sort();
    }, [employee]);

    // Filtrar empleados
    const filteredEmployees = useMemo(() => {
        return employee.filter((employee) => {
            // Filtro por término de búsqueda
            const matchesSearch =
                searchTerm === '' ||
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()));

            // Filtro por departamentos
            const matchesDepartment = selectedDepartments.length === 0 || (employee.department && selectedDepartments.includes(employee.department));

            return matchesSearch && matchesDepartment;
        });
    }, [searchTerm, selectedDepartments, employee]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEmployee) {
            updateEmployee(editingEmployee.id, formData);
        } else {
            addEmployee(formData);
        }
        closeDialog();
    };

    const handleAddEmployee = () => {
        openDialog(); // Sin parámetros para nuevo empleado
    };

    const handleEditEmployee = (employee: Employee) => {
        openDialog(employee); // Con empleado para edición
    };

    return (
        <div className="h-full w-full">
            <ScrollArea className="h-full w-full">
                <div className="container mx-auto p-2">
                    {/* Header - Responsive */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                                {isAdmin ? 'Administración de Empleados' : 'Directorio de Empleados'}
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                {isAdmin
                                    ? 'Gestiona la información de todos los empleados de la empresa'
                                    : 'Consulta la información de contacto de tus compañeros de trabajo'}
                            </p>
                        </div>
                        {isAdmin && (
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        closeDialog();
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button onClick={handleAddEmployee} className="w-full gap-2 sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Agregar Empleado</span>
                                        <span className="sm:hidden">Agregar</span>
                                    </Button>
                                </DialogTrigger>
                                <EmployeeFormDialog
                                    isOpen={isDialogOpen}
                                    onClose={closeDialog}
                                    onSubmit={handleSubmit}
                                    formData={formData}
                                    updateField={updateField}
                                    editingEmployee={editingEmployee}
                                />
                            </Dialog>
                        )}
                    </div>

                    {/* Componente de filtro */}
                    <UsersFilter
                        departments={departments}
                        selectedDepartments={selectedDepartments}
                        setSelectedDepartments={setSelectedDepartments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <EmployeeTable
                        employees={filteredEmployees}
                        totalEmployees={getTotalEmployees()}
                        activeEmployeesCount={getActiveEmployeesCount()}
                        onEdit={handleEditEmployee}
                        onDelete={deleteEmployee}
                        isAdmin={isAdmin}
                        selectedDepartments={selectedDepartments}
                    />
                </div>
            </ScrollArea>
        </div>
    );
}
