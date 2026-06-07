'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminOrderGroup } from '@/types/order/order';
import { useRouter } from 'next/navigation';

interface OrderTableActionProps {
    data: AdminOrderGroup;
}

export const OrderTableAction: React.FC<OrderTableActionProps> = ({ data }) => {
    const { push } = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => push(`/admin/dashboard/orders/${data.id}`)}
                >
                    <Eye className="mr-2 size-4" /> Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => push(`/admin/dashboard/orders/${data.id}`)}
                >
                    <Edit className="mr-2 size-4" /> Cập nhật trạng thái
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
