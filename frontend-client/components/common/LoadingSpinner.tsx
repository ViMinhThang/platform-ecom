import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
};

/**
 * Reusable loading spinner component
 * Provides consistent loading UI across the application
 * 
 * @example
 * <LoadingSpinner size="lg" message="Đang tải đơn hàng..." />
 * <LoadingSpinner fullScreen />
 */
export function LoadingSpinner({
    size = 'md',
    message,
    fullScreen = false,
    className
}: LoadingSpinnerProps) {
    const spinner = (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
            <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
            {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                {spinner}
            </div>
        );
    }

    return <div className="flex justify-center items-center py-12">{spinner}</div>;
}
