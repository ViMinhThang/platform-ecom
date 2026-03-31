import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date for order display (e.g., "15 thg 1, 2026")
 */
export function formatOrderDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'dd MMM, yyyy', { locale: vi });
    } catch {
        return 'N/A';
    }
}

/**
 * Format date in long format (e.g., "January 15, 2026")
 */
export function formatLongDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'PPP');
    } catch {
        return 'N/A';
    }
}

/**
 * Format date in short format (e.g., "01/15/2026")
 */
export function formatShortDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'MM/dd/yyyy');
    } catch {
        return 'N/A';
    }
}

/**
 * Format date relative to now (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
        return 'N/A';
    }
}
