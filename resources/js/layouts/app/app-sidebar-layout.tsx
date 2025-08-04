import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavItem, type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { useFlashMessage } from '@/hooks/useFlashMessage';

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    mainNavItems?: NavItem[];
    variant?: 'inset' | 'floating' | 'sidebar';
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    mainNavItems = [],
    variant = 'inset',
}: PropsWithChildren<AppSidebarLayoutProps>) {
    useFlashMessage();
    return (
        <AppShell variant="sidebar">
            <AppSidebar mainNavItems={mainNavItems} variant={variant} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}