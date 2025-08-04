import { Employee } from '@/types/employee';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
export interface UseEmployeesReturn {
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    updateEmployee: (id: string, employee: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    getActiveEmployees: () => Employee[];
    getTotalEmployees: () => number;
    getActiveEmployeesCount: () => number;
}

export const useEmployees = ({ employee }: { employee: Employee[] }): UseEmployeesReturn => {
    const [employees] = useState<Employee[]>(employee || []);

    const addEmployee = useCallback((employeeData: Omit<Employee, 'id'>) => {
        const formData = new FormData();

        Object.entries(employeeData).forEach(([key, value]) => {
            formData.append(key, String(value ?? ''));
        });

        router.post(route('admin.create.employee'), formData);
    }, []);

    const updateEmployee = useCallback((id: string, employeeData: Partial<Employee>) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.entries(employeeData).forEach(([key, value]) => {
            formData.append(key, String(value ?? ''));
        });
        router.post(route('admin.update.employee', { userId: id }), formData);
    }, []);

    const deleteEmployee = useCallback((id: string) => {
        router.delete(route('admin.delete.employee', { userId: id }));
    }, []);

    const getActiveEmployees = useCallback(() => {
        return employee.filter((employee: Employee) => employee.status === 'active');
    }, [employee]);

    const getTotalEmployees = useCallback(() => employee.length, [employee]);

    const getActiveEmployeesCount = useCallback(() => {
        return getActiveEmployees().length;
    }, [getActiveEmployees]);

    return {
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getActiveEmployees,
        getTotalEmployees,
        getActiveEmployeesCount,
    };
};
