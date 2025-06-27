import type React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DynamicFormField } from './DynamicFormField';
import { EMPLOYEE_FORM_FIELDS } from '@/constants/employeeConstants';
import { Employee, EmployeeFormData } from '@/types/employee';

interface EmployeeFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: EmployeeFormData;
    updateField: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;
    editingEmployee: Employee | null;
}

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    updateField,
    editingEmployee,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingEmployee ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingEmployee 
                            ? 'Modifica la información del empleado seleccionado.' 
                            : 'Completa los datos del nuevo empleado.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        {EMPLOYEE_FORM_FIELDS.map((field) => (
                            <DynamicFormField
                                key={field.id}
                                field={field}
                                value={formData[field.id as keyof EmployeeFormData]}
                                onChange={(value) => updateField(field.id as keyof EmployeeFormData, value)}
                            />
                        ))}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingEmployee ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
