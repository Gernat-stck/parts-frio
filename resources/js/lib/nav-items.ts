import { LayoutGrid, ListChecks, UserRoundCog } from 'lucide-react';
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
    {
        title: 'Users',
        href: route('admin.users'),
        icon: UserRoundCog,
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
