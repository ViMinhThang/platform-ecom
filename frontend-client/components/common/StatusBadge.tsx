import { Badge } from '@/components/ui/badge';
import { getOrderStatusColor } from '@/lib/utils/orderStatus';
import { getOrderStatusLabel } from '@/lib/utils/order-labels';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'outline';
    className?: string;
}

/**
 * Specialized badge component for order statuses
 * Automatically applies correct colors based on status
 * 
 * @example
 * <StatusBadge status="delivered" />
 * <StatusBadge status="processing" variant="outline" />
 */
export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
    return (
        <Badge
            variant={variant}
            className={cn(
                variant === 'default' && getOrderStatusColor(status),
                className
            )}
        >
            {getOrderStatusLabel(status.toUpperCase())}
        </Badge>
    );
}
