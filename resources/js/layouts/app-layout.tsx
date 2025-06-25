import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { NavItem, type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    mainNavItems?: NavItem[];
    variant?: 'inset' | 'floating' | 'sidebar';
}

export default ({ children, breadcrumbs, mainNavItems, variant, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={mainNavItems} variant={variant} {...props}>
        {children}
    </AppLayoutTemplate>
);
