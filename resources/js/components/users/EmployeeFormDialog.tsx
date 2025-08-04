import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EMPLOYEE_FORM_FIELDS } from '@/constants/employeeConstants';
import type { Employee, EmployeeFormData } from '@/types/employee';
import { User, UserPlus } from 'lucide-react';
import type React from 'react';
import { DynamicFormField } from './DynamicFormField';

interface EmployeeFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: EmployeeFormData;
    updateField: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;
    editingEmployee: Employee | null;
}

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({ isOpen, onClose, onSubmit, formData, updateField, editingEmployee }) => {
    // Separar campos para layout personalizado
    const getFieldLayout = () => {
        const fields = EMPLOYEE_FORM_FIELDS;
        const startDateField = fields.find((f) => f.id === 'startDate');
        const statusField = fields.find((f) => f.id === 'status');
        const otherFields = fields.filter((f) => f.id !== 'startDate' && f.id !== 'status');

        return { startDateField, statusField, otherFields };
    };

    const { startDateField, statusField, otherFields } = getFieldLayout();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="mx-2 flex h-[95vh] w-[calc(100vw-1rem)] max-w-2xl flex-col overflow-hidden sm:mx-4 sm:h-[95vh] sm:w-[95vw] lg:h-[95vh] lg:w-[80vw] xl:max-w-3xl">
                {/* Header - Fixed */}
                <DialogHeader className="flex-shrink-0 pb-2 sm:pb-3">
                    <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        {editingEmployee ? (
                            <>
                                <User className="h-5 w-5" />
                                Editar Empleado
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                Agregar Nuevo Empleado
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        {editingEmployee ? 'Modifica la información del empleado seleccionado.' : 'Completa los datos del nuevo empleado.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Form Content - Flexible */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <form onSubmit={onSubmit} className="space-y-4 pr-2 sm:space-y-4 sm:pr-4">
                            {/* Grid Layout - Responsive */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                {/* Otros campos con layout inteligente */}
                                {otherFields.map((field) => {
                                    // Determine if field should span full width
                                    const isFullWidth = field.type === 'select' || field.id === 'name' || field.id === 'email';

                                    return (
                                        <div key={field.id} className={`${isFullWidth ? 'sm:col-span-2' : ''}`}>
                                            <DynamicFormField
                                                field={field}
                                                value={formData[field.id as keyof EmployeeFormData]}
                                                onChange={(value) => updateField(field.id as keyof EmployeeFormData, value)}
                                                isEditing={!!editingEmployee}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Fila especial: Fecha de inicio + Estado */}
                                {startDateField && (
                                    <div>
                                        <DynamicFormField
                                            field={startDateField}
                                            value={formData[startDateField.id as keyof EmployeeFormData]}
                                            onChange={(value) => updateField(startDateField.id as keyof EmployeeFormData, value)}
                                            isEditing={!!editingEmployee}
                                        />
                                    </div>
                                )}

                                {statusField && (
                                    <div>
                                        <DynamicFormField
                                            field={statusField}
                                            value={formData[statusField.id as keyof EmployeeFormData]}
                                            onChange={(value) => updateField(statusField.id as keyof EmployeeFormData, value)}
                                            isEditing={!!editingEmployee}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Form Validation Info */}
                            <div className="rounded-lg bg-muted/50 p-2">
                                <div className="flex items-start gap-2">
                                    <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                    <div className="text-xs text-muted-foreground sm:text-sm">
                                        <strong>Nota:</strong> Todos los campos marcados con asterisco (*) son obligatorios. Asegúrate de completar
                                        toda la información antes de guardar.
                                    </div>
                                </div>
                            </div>

                            {/* Bottom padding for mobile */}
                            <div className="h-4 sm:h-0" />
                        </form>
                    </ScrollArea>
                </div>

                {/* Footer - Fixed */}
                <DialogFooter className="mt-2 flex-shrink-0 border-t pt-2">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full bg-transparent sm:w-auto sm:min-w-[100px]">
                            Cancelar
                        </Button>
                        <Button type="submit" onClick={onSubmit} className="w-full sm:w-auto sm:min-w-[100px]">
                            {editingEmployee ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
