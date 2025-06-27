import type React from 'react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employee';
import { Plus } from 'lucide-react';
import { Auth } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { EmployeeTable } from './EmployeeTable';
import UsersFilter from './users-filter';

interface UserManagementProps {
    auth: Auth;
}

export default function UserManagement({ auth }: UserManagementProps) {
    const isAdmin: boolean = auth.user.role === 'admin' || auth.user.role === 'super-admin';
    const { employees, addEmployee, updateEmployee, deleteEmployee, getTotalEmployees, getActiveEmployeesCount } = useEmployees();
    const { formData, editingEmployee, isDialogOpen, openDialog, closeDialog, updateField } = useEmployeeForm();

    // Estados para el filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    // Obtener departamentos únicos
    const departments = useMemo(() => {
        const uniqueDepartments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))];
        return uniqueDepartments.sort();
    }, [employees]);

    // Filtrar empleados
    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
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
    }, [employees, searchTerm, selectedDepartments]);

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
        <ScrollArea className="h-full w-full">
            <div className="container mx-auto space-y-2 ">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{isAdmin ? 'Administración de Empleados' : 'Directorio de Empleados'}</h1>
                        <p className="mt-2 text-muted-foreground">
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
                                <Button onClick={handleAddEmployee} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Agregar Empleado
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
    );
}
