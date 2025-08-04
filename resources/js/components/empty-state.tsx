import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Database, FileText, Filter, Inbox, Package, Plus, RefreshCw, Search, ShoppingCart, Users } from 'lucide-react';
import type React from 'react';

interface EmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
    icon?: React.ReactNode;
}

interface EmptyStateProps {
    /**
     * Tipo de estado vacío predefinido
     */
    type?: 'no-data' | 'no-results' | 'no-products' | 'no-users' | 'no-orders' | 'no-files' | 'error' | 'custom';
    /**
     * Título principal
     */
    title?: string;
    /**
     * Descripción o subtítulo
     */
    description?: string;
    /**
     * Icono personalizado (solo para type="custom")
     */
    icon?: React.ReactNode;
    /**
     * Tamaño del componente
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Acciones disponibles (botones)
     */
    actions?: EmptyStateAction[];
    /**
     * Mostrar en una tarjeta o solo el contenido
     */
    showCard?: boolean;
    /**
     * Clase CSS adicional
     */
    className?: string;
}

const presetConfigs = {
    'no-data': {
        icon: <Database className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No hay datos disponibles',
        description: 'No se encontraron registros en la base de datos.',
    },
    'no-results': {
        icon: <Search className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No se encontraron resultados',
        description: 'Intenta ajustar los filtros de búsqueda o crear un nuevo registro.',
    },
    'no-products': {
        icon: <Package className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No hay productos',
        description: 'Aún no has agregado ningún producto. Comienza creando tu primer producto.',
    },
    'no-users': {
        icon: <Users className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No hay usuarios',
        description: 'No se encontraron usuarios registrados en el sistema.',
    },
    'no-orders': {
        icon: <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No hay pedidos',
        description: 'No se han realizado pedidos todavía.',
    },
    'no-files': {
        icon: <FileText className="h-12 w-12 text-gray-400 dark:text-gray-200" />,
        title: 'No hay archivos',
        description: 'No se encontraron archivos en esta ubicación.',
    },
    error: {
        icon: <AlertCircle className="h-12 w-12 text-red-400" />,
        title: 'Error al cargar datos',
        description: 'Ocurrió un problema al cargar la información. Intenta nuevamente.',
    },
};

const sizeClasses = {
    sm: {
        container: 'py-8 px-4',
        icon: 'w-8 h-8',
        title: 'text-lg font-medium',
        description: 'text-sm',
        spacing: 'space-y-3',
    },
    md: {
        container: 'py-12 px-6',
        icon: 'w-12 h-12',
        title: 'text-xl font-semibold',
        description: 'text-base',
        spacing: 'space-y-4',
    },
    lg: {
        container: 'py-16 px-8',
        icon: 'w-16 h-16',
        title: 'text-2xl font-bold',
        description: 'text-lg',
        spacing: 'space-y-6',
    },
};

export default function EmptyState({
    type = 'no-data',
    title,
    description,
    icon,
    size = 'md',
    actions = [],
    showCard = true,
    className = '',
}: EmptyStateProps) {
    const config = type === 'custom' ? {} : presetConfigs[type];
    const sizeConfig = sizeClasses[size];

    const finalTitle = title || config.title || 'No hay datos';
    const finalDescription = description || config.description || '';
    const finalIcon = icon || config.icon || <Inbox className={`${sizeConfig.icon} text-gray-400`} />;

    const content = (
        <div className={`text-center ${sizeConfig.container} ${className}`}>
            <div className={`flex flex-col items-center ${sizeConfig.spacing}`}>
                {/* Icono */}
                <div className="flex items-center justify-center">{finalIcon}</div>

                {/* Texto */}
                <div className="space-y-2">
                    <h3 className={`${sizeConfig.title} text-gray-900 dark:text-gray-50`}>{finalTitle}</h3>
                    {finalDescription && <p className={`${sizeConfig.description} max-w-md text-gray-500`}>{finalDescription}</p>}
                </div>

                {/* Acciones */}
                {actions.length > 0 && (
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                        {actions.map((action, index) => (
                            <Button key={index} variant={action.variant || 'default'} onClick={action.onClick} className="flex items-center gap-2">
                                {action.icon}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (showCard) {
        return (
            <Card className="w-full">
                <CardContent className="p-0">{content}</CardContent>
            </Card>
        );
    }

    return content;
}

// Componente de conveniencia para productos específicamente
export function EmptyProducts({
    onCreateProduct,
    onClearFilters,
    hasFilters = false,
}: {
    onCreateProduct?: () => void;
    onClearFilters?: () => void;
    hasFilters?: boolean;
}) {
    const actions: EmptyStateAction[] = [];

    if (onCreateProduct) {
        actions.push({
            label: 'Crear Producto',
            onClick: onCreateProduct,
            variant: 'default',
            icon: <Plus className="h-4 w-4" />,
        });
    }

    if (hasFilters && onClearFilters) {
        actions.push({
            label: 'Limpiar Filtros',
            onClick: onClearFilters,
            variant: 'outline',
            icon: <Filter className="h-4 w-4" />,
        });
    }

    return (
        <EmptyState
            type={hasFilters ? 'no-results' : 'no-products'}
            title={hasFilters ? 'No se encontraron productos' : 'No hay productos'}
            description={
                hasFilters
                    ? 'No hay productos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.'
                    : 'Aún no has agregado ningún producto. Comienza creando tu primer producto para gestionar tu inventario.'
            }
            actions={actions}
        />
    );
}

// Componente de conveniencia para errores
export function EmptyError({ onRetry, message }: { onRetry?: () => void; message?: string }) {
    const actions: EmptyStateAction[] = [];

    if (onRetry) {
        actions.push({
            label: 'Intentar nuevamente',
            onClick: onRetry,
            variant: 'default',
            icon: <RefreshCw className="h-4 w-4" />,
        });
    }

    return <EmptyState type="error" description={message || 'Ocurrió un problema al cargar la información. Intenta nuevamente.'} actions={actions} />;
}
