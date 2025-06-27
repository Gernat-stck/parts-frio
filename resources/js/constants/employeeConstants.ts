export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'date' | 'select';
    placeholder?: string;
    required: boolean;
    options?: Array<{ value: string; label: string }>;
}

export const EMPLOYEE_FORM_FIELDS: FormField[] = [
    {
        id: 'name',
        label: 'Nombre completo',
        type: 'text',
        placeholder: 'Ej: Ana García',
        required: true,
    },
    {
        id: 'email',
        label: 'Correo electrónico',
        type: 'email',
        placeholder: 'ana.garcia@empresa.com',
        required: true,
    },
    {
        id: 'phone',
        label: 'Número de contacto',
        type: 'tel',
        placeholder: '+34 612 345 678',
        required: true,
    },
    {
        id: 'position',
        label: 'Cargo/Posición',
        type: 'text',
        placeholder: 'Ej: Desarrolladora Frontend',
        required: true,
    },
    {
        id: 'department',
        label: 'Departamento',
        type: 'select',
        required: true,
        options: [
            { value: 'IT', label: 'IT' },
            { value: 'Recursos Humanos', label: 'Recursos Humanos' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Ventas', label: 'Ventas' },
            { value: 'Finanzas', label: 'Finanzas' },
            { value: 'Operaciones', label: 'Operaciones' },
        ],
    },
    {
        id: 'startDate',
        label: 'Fecha de inicio',
        type: 'date',
        required: true,
    },
    {
        id: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
            { value: 'active', label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' },
        ],
    },
];

export const TABLE_HEADERS_ADMIN = ['Empleado', 'Contacto', 'Cargo', 'Departamento', 'Antigüedad', 'Estado', 'Acciones'] as const;

export const TABLE_HEADERS_EMPLOYEES = ['Empleado', 'Contacto', 'Cargo', 'Departamento'] as const;
