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
