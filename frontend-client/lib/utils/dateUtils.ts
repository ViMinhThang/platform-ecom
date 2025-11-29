import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date for order display (e.g., "Jan 15, 2024")
 */
export function formatOrderDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'MMM dd, yyyy');
    } catch {
        return 'N/A';
    }
}

/**
 * Format date in long format (e.g., "January 15, 2024")
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
 * Format date in short format (e.g., "01/15/2024")
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
