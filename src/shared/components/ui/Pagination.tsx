'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    searchParams?: Record<string, string | undefined>;
}

export function Pagination({
    currentPage,
    totalPages,
    basePath,
    searchParams = {},
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const buildUrl = (page: number) => {
        const params = new URLSearchParams();

        // Add existing search params
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        // Add page param
        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        const queryString = params.toString();
        return queryString ? `${basePath}?${queryString}` : basePath;
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show current page as first, then next 4 pages
            const start = currentPage;
            const end = Math.min(currentPage + maxVisible - 1, totalPages);

            // Add ellipsis before if not starting from page 1
            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('ellipsis');
                }
            }

            // Add the range of pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after if not ending at last page
            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push('ellipsis');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <nav className="flex flex-wrap items-center justify-center gap-2 py-8 px-4" aria-label="Pagination">
            {/* Previous Button */}
            <Link
                href={buildUrl(currentPage - 1)}
                className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    currentPage === 1
                        ? 'pointer-events-none text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
                {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <Link
                            key={page}
                            href={buildUrl(page)}
                            className={cn(
                                'min-w-[36px] px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors',
                                currentPage === page
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </Link>
                    )
                )}
            </div>

            {/* Next Button */}
            <Link
                href={buildUrl(currentPage + 1)}
                className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    currentPage === totalPages
                        ? 'pointer-events-none text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-disabled={currentPage === totalPages}
            >
                <span className="hidden sm:inline">Berikutnya</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
            </Link>
        </nav>
    );
}
