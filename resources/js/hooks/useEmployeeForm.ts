import { Employee, EmployeeFormData } from '@/types/employee';
import { useCallback, useState } from 'react';

const initialFormState: EmployeeFormData = {
    name: '',
    email: '',
    phone: '',
    startDate: '',
    department: '', 
    position: '',
    status: 'active',
};

export interface UseEmployeeFormReturn {
    formData: EmployeeFormData;
    editingEmployee: Employee | null;
    isDialogOpen: boolean;
    setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
    openDialog: (employee?: Employee) => void;
    closeDialog: () => void;
    resetForm: () => void;
    updateField: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;
}

export const useEmployeeForm = (): UseEmployeeFormReturn => {
    const [formData, setFormData] = useState<EmployeeFormData>(initialFormState);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const resetForm = useCallback(() => {
        setFormData(initialFormState);
        setEditingEmployee(null);
    }, []);

    const openDialog = useCallback((employee?: Employee) => {
        if (employee) {
            // Modo edición
            setEditingEmployee(employee);
            setFormData({
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                department: employee.department || '', // Asegurarse de que el campo no sea undefined
                startDate: employee.startDate,
                position: employee.position,
                status: employee.status,
            });
        } else {
            // Modo creación - nuevo empleado
            setEditingEmployee(null);
            setFormData(initialFormState);
        }

        setIsDialogOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setIsDialogOpen(false);
        // No resetear el form inmediatamente para evitar conflictos
        setTimeout(() => {
            resetForm();
        }, 100);
    }, [resetForm]);

    const updateField = useCallback(<K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    return {
        formData,
        editingEmployee,
        isDialogOpen,
        setFormData,
        openDialog,
        closeDialog,
        resetForm,
        updateField,
    };
};
