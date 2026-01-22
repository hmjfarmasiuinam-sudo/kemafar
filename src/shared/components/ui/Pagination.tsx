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
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1 py-8" aria-label="Pagination">
            {/* Previous Button */}
            <Link
                href={buildUrl(currentPage - 1)}
                className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === 1
                        ? 'pointer-events-none text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" />
                Prev
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <Link
                            key={page}
                            href={buildUrl(page)}
                            className={cn(
                                'min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors',
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
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === totalPages
                        ? 'pointer-events-none text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-disabled={currentPage === totalPages}
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </Link>
        </nav>
    );
}
