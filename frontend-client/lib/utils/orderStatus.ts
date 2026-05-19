import { ORDER_STATUSES } from '../constants';

/**
 * Get Tailwind CSS classes for order status badge styling
 * @param status - Order status string
 * @returns Tailwind CSS classes for badge background and text colors
 */
export function getOrderStatusColor(status: string): string {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
        case ORDER_STATUSES.DELIVERED:
            return 'bg-green-100 text-green-800 hover:bg-green-100';
        case ORDER_STATUSES.SHIPPED:
            return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        case ORDER_STATUSES.PROCESSING:
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case ORDER_STATUSES.CANCELLED:
            return 'bg-red-100 text-red-800 hover:bg-red-100';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
}

/**
 * Check if an order status allows reviews
 * @param status - Order status string
 * @returns true if order is delivered (can be reviewed)
 */
export function canReviewOrder(status: string): boolean {
    return status.toLowerCase() === ORDER_STATUSES.DELIVERED;
}
