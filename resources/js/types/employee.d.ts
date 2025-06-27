export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    startDate: string;
    position: string;
    department: string;
    status: 'active' | 'inactive';
}

export type EmployeeFormData = Omit<Employee, 'id'>;
