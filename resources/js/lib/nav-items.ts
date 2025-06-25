import { LayoutGrid, ListChecks } from 'lucide-react';
import { NavItem } from '../types';

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        href: route('admin.inventory'),
        icon: ListChecks,
    },
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
