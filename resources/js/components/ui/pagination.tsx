import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

interface PaginationProps {
  /**
   * Número total de páginas
   */
  totalPages: number;
  
  /**
   * Página actual
   */
  currentPage: number;
  
  /**
   * Función que se ejecuta al cambiar de página
   */
  onPageChange: (page: number) => void;
  
  /**
   * Información sobre los elementos mostrados
   */
  pageInfo?: {
    startIndex: number;
    endIndex: number;
    total: number;
    itemName?: string;
  };
  
  /**
   * Número máximo de botones de página a mostrar
   * @default 5
   */
  maxPageButtons?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  pageInfo,
  maxPageButtons = 5,
}: PaginationProps) {
  /**
   * Determina qué botones de página mostrar basado en la página actual
   */
  const getPageButtons = useCallback(() => {
    if (totalPages <= maxPageButtons) {
      // Si hay menos páginas que el máximo de botones, mostrar todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Mostrar siempre la primera y última página, y botones alrededor de la página actual
    const halfMaxButtons = Math.floor((maxPageButtons - 2) / 2);
    let startPage = Math.max(2, currentPage - halfMaxButtons);
    const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3);

    // Ajustar si estamos cerca del final
    if (endPage - startPage < maxPageButtons - 3) {
      startPage = Math.max(2, endPage - (maxPageButtons - 3));
    }

    const pages = [1];
    
    // Añadir elipsis si hay un salto desde la página 1
    if (startPage > 2) {
      pages.push(-1); // -1 representa la elipsis
    }
    
    // Añadir páginas del medio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Añadir elipsis si hay un salto hasta la última página
    if (endPage < totalPages - 1) {
      pages.push(-2); // -2 representa la elipsis (distinto valor para key única)
    }
    
    // Añadir última página si hay más de una página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  }, [totalPages, currentPage, maxPageButtons]);

  // Si solo hay una página, no mostrar paginación
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      {pageInfo && (
        <div className="text-sm text-gray-600">
          Mostrando {pageInfo.startIndex} a {pageInfo.endIndex} de {pageInfo.total} {pageInfo.itemName || 'elementos'}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Anterior</span>
        </Button>
        
        <div className="hidden items-center gap-1 sm:flex">
          {getPageButtons().map((page) => (
            page < 0 ? (
              // Elipsis
              <div key={page} className="flex h-8 w-8 items-center justify-center text-sm">
                ...
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
                aria-label={`Ir a página ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            )
          ))}
        </div>
        
        <div className="flex items-center gap-1 sm:hidden">
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <span className="mr-1">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}