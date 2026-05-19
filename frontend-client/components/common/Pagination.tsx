'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * Reusable pagination component
 * Provides consistent pagination UI with previous/next navigation
 * 
 * @example
 * <Pagination
 *   currentPage={0}
 *   totalPages=bb{5}
 *   onPageChange={(page) => fetchData(page)}
 * />
 */
export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    className
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    return (
        <div className={cn("flex justify-center items-center space-x-2 pt-4", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage || disabled}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage || disabled}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
