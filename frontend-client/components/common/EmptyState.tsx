'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

/**
 * Reusable empty state component
 * Displays friendly message when no data is available
 * 
 * @example
 * <EmptyState
 *   icon={<Package className="h-12 w-12" />}
 *   title="No orders found"
 *   description="Your order history will appear here"
 *   action={{ label: "Start Shopping", onClick: () => router.push('/') }}
 * />
 */
export function EmptyState({
    icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground",
            className
        )}>
            {icon && (
                <div className="flex justify-center mb-4 opacity-50">
                    {icon}
                </div>
            )}
            <p className="text-lg font-medium text-foreground">{title}</p>
            {description && (
                <p className="text-sm mt-2">{description}</p>
            )}
            {action && (
                <Button
                    onClick={action.onClick}
                    variant="outline"
                    className="mt-4"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
