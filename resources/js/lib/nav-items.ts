import { HandCoins, LayoutGrid, ListChecks, UserRoundCog } from 'lucide-react';
import { NavItem } from '../types';

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Inventario',
        href: route('admin.inventory'),
        icon: ListChecks,
    },
    {
        title: 'Usuarios',
        href: route('admin.users'),
        icon: UserRoundCog,
    },
    {
        title: 'Punto de Venta',
        href: route('admin.sales'),
        icon: HandCoins,
    }

];

export const employeeNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('employee.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        href: route('employee.inventory'),
        icon: ListChecks,
    },
];
