'use client';

import { Badge } from '@/components/ui/badge';
import { FlashSaleStatus } from '@/types/flash-sale';

interface FlashSaleStatusBadgeProps {
    status: FlashSaleStatus;
}

const statusConfig: Record<FlashSaleStatus, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SCHEDULED: { label: 'Scheduled', variant: 'outline' },
    ACTIVE: { label: 'Active', variant: 'default' },
    ENDED: { label: 'Ended', variant: 'secondary' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive' },
};

export function FlashSaleStatusBadge({ status }: FlashSaleStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} className="uppercase text-[10px] font-black tracking-wider">
            {config.label}
        </Badge>
    );
}
