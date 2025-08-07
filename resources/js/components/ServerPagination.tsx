import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback } from "react";

interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    onPageChange: (page: number) => void;
    pageInfo?: {
        itemName?: string;
    };
    maxPageButtons?: number;
}

export function ServerPagination({ meta, links, onPageChange, pageInfo, maxPageButtons = 5 }: PaginationProps) {
    const { current_page, last_page, per_page, total } = meta;
    const startIndex = (current_page - 1) * per_page;
    const endIndex = Math.min(startIndex + per_page, total);

    const getPageButtons = useCallback(() => {
        if (last_page <= maxPageButtons) {
            return Array.from({ length: last_page }, (_, i) => i + 1);
        }

        const halfMaxButtons = Math.floor((maxPageButtons - 2) / 2);
        let startPage = Math.max(2, current_page - halfMaxButtons);
        const endPage = Math.min(last_page - 1, startPage + maxPageButtons - 3);

        if (endPage - startPage < maxPageButtons - 3) {
            startPage = Math.max(2, endPage - (maxPageButtons - 3));
        }

        const pages = [1];

        if (startPage > 2) {
            pages.push(-1); // elipsis
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < last_page - 1) {
            pages.push(-2); // elipsis
        }

        if (last_page > 1) {
            pages.push(last_page);
        }

        return pages;
    }, [current_page, last_page, maxPageButtons]);

    if (last_page <= 1) return null;

    return (
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {endIndex} de {total} {pageInfo?.itemName || 'elementos'}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={!links.prev}
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="ml-1">Anterior</span>
                </Button>

                <div className="hidden items-center gap-1 sm:flex">
                    {getPageButtons().map((page) =>
                        page < 0 ? (
                            <div key={page} className="flex h-8 w-8 items-center justify-center text-sm">
                                ...
                            </div>
                        ) : (
                            <Button
                                key={page}
                                variant={current_page === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="h-8 w-8 p-0"
                                aria-label={`Ir a página ${page}`}
                                aria-current={current_page === page ? 'page' : undefined}
                            >
                                {page}
                            </Button>
                        ),
                    )}
                </div>

                <div className="flex items-center gap-1 sm:hidden">
                    <span className="text-sm font-medium">
                        {current_page} / {last_page}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={!links.next}
                    aria-label="Página siguiente"
                >
                    <span className="mr-1">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
