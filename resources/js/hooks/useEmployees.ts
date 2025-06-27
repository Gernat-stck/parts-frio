import { useState, useCallback } from 'react';
import { Employee } from '@/types/employee';
const initialEmployees: Employee[] = [
    {
        id: '1',
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        phone: '+34 612 345 678',
        startDate: '2022-03-15',
        position: 'Desarrolladora Frontend',
        department: 'IT',
        status: 'active',
    },
    {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        phone: '+34 687 654 321',
        startDate: '2021-08-20',
        position: 'Diseñador UX/UI',
        department: 'IT',
        status: 'active',
    },
    {
        id: '3',
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        phone: '+34 698 123 456',
        startDate: '2023-01-10',
        position: 'Project Manager',
        department: 'IT',
        status: 'active',
    },
    {
        id: '4',
        name: 'David Martín',
        email: 'david.martin@empresa.com',
        phone: '+34 645 987 123',
        startDate: '2020-11-05',
        position: 'Backend Developer',
        department: 'IT',
        status: 'inactive',
    },
    {
        id: '5',
        name: 'Laura Fernández',
        email: 'laura.fernandez@empresa.com',
        phone: '+34 634 567 890',
        startDate: '2022-07-12',
        position: 'Especialista en Reclutamiento',
        department: 'Recursos Humanos',
        status: 'active',
    },
    {
        id: '6',
        name: 'Roberto Silva',
        email: 'roberto.silva@empresa.com',
        phone: '+34 678 901 234',
        startDate: '2021-11-03',
        position: 'Gerente de Marketing',
        department: 'Marketing',
        status: 'active',
    },
    {
        id: '7',
        name: 'Carmen Ruiz',
        email: 'carmen.ruiz@empresa.com',
        phone: '+34 645 123 789',
        startDate: '2023-02-20',
        position: 'Analista Financiero',
        department: 'Finanzas',
        status: 'active',
    },
    {
        id: '8',
        name: 'Javier Moreno',
        email: 'javier.moreno@empresa.com',
        phone: '+34 612 987 654',
        startDate: '2022-09-15',
        position: 'Ejecutivo de Ventas',
        department: 'Ventas',
        status: 'active',
    },
];



export interface UseEmployeesReturn {
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    updateEmployee: (id: string, employee: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    getActiveEmployees: () => Employee[];
    getTotalEmployees: () => number;
    getActiveEmployeesCount: () => number;
}

export const useEmployees = (): UseEmployeesReturn => {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

    const addEmployee = useCallback((employeeData: Omit<Employee, 'id'>) => {
        const newEmployee: Employee = {
            id: Date.now().toString(),
            ...employeeData,
        };
        setEmployees(prev => [...prev, newEmployee]);
    }, []);

    const updateEmployee = useCallback((id: string, employeeData: Partial<Employee>) => {
        setEmployees(prev => 
            prev.map(employee => 
                employee.id === id ? { ...employee, ...employeeData } : employee
            )
        );
    }, []);

    const deleteEmployee = useCallback((id: string) => {
        setEmployees(prev => prev.filter(employee => employee.id !== id));
    }, []);

    const getActiveEmployees = useCallback(() => {
        return employees.filter(employee => employee.status === 'active');
    }, [employees]);

    const getTotalEmployees = useCallback(() => employees.length, [employees]);

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
