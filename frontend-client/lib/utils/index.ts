/**
 * Utility functions index
 * Re-exports all utility functions for easy import
 */

// Class name utility (from dedicated file)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



// Order status utilities
export { getOrderStatusColor, canReviewOrder } from './orderStatus';

// Date formatting utilities
export {
    formatOrderDate,
    formatLongDate,
    formatShortDate,
    formatRelativeTime
} from './dateUtils';

export function formatBytes(
    bytes: number,
    opts: {
        decimals?: number;
        sizeType?: 'accurate' | 'normal';
    } = {}
) {
    const { decimals = 0, sizeType = 'normal' } = opts;

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === 'accurate'
        ? (accurateSizes[i] ?? 'Bytest')
        : (sizes[i] ?? 'Bytes')
        }`;
}
