/**
 * Formatting Utilities
 * Helper functions for formatting dates, currency, numbers, etc.
 */

/**
 * Formats a date value
 */
export function formatDate(
    date: Date | string | number | undefined,
    opts: Intl.DateTimeFormatOptions = {}
): string {
    if (!date) return '';

    try {
        return new Intl.DateTimeFormat('en-US', {
            month: opts.month ?? 'long',
            day: opts.day ?? 'numeric',
            year: opts.year ?? 'numeric',
            ...opts
        }).format(new Date(date));
    } catch (_err) {
        return '';
    }
}

/**
 * Formats a currency value
 */
export function formatCurrency(
    amount: number | undefined,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    if (amount === undefined || amount === null) return '';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(amount);
    } catch (_err) {
        return String(amount);
    }
}

/**
 * Formats a number with optional decimal places
 */
export function formatNumber(
    value: number | undefined,
    decimals?: number,
    locale: string = 'en-US'
): string {
    if (value === undefined || value === null) return '';

    try {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    } catch (_err) {
        return String(value);
    }
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
    date: Date | string | number | undefined
): string {
    if (!date) return '';

    try {
        const now = new Date();
        const then = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (diffInSeconds < 60) {
            return rtf.format(-diffInSeconds, 'second');
        } else if (diffInSeconds < 3600) {
            return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
        } else if (diffInSeconds < 86400) {
            return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
        } else if (diffInSeconds < 2592000) {
            return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
        } else if (diffInSeconds < 31536000) {
            return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
        } else {
            return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
        }
    } catch (_err) {
        return '';
    }
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
