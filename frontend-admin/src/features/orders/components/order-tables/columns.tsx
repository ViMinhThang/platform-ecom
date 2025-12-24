'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AdminOrderGroup } from '@/types/order/order';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { OrderTableAction } from './order-table-action';

export const columns: ColumnDef<AdminOrderGroup>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Chọn tất cả"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Chọn hàng"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'groupNumber',
        header: 'Mã đơn hàng',
        cell: ({ row }) => <span className="font-medium">{row.original.groupNumber}</span>,
    },
    {
        accessorKey: 'userName',
        header: 'Khách hàng',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.userName}</span>
                <span className="text-xs text-muted-foreground">{row.original.userEmail}</span>
            </div>
        ),
    },
    {
        accessorKey: 'totalAmount',
        header: 'Tổng tiền',
        cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },
    {
        accessorKey: 'paymentStatus',
        header: 'Thanh toán',
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
            let label = status;

            if (status === 'COMPLETED') { variant = 'default'; label = 'Hoàn tất'; }
            if (status === 'PENDING') { variant = 'secondary'; label = 'Chờ xử lý'; }
            if (status === 'FAILED') { variant = 'destructive'; label = 'Thất bại'; }

            return <Badge variant={variant}>{label}</Badge>;
        },
    },
    {
        accessorKey: 'overallStatus',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.original.overallStatus;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
            let label = status;

            if (status === 'DELIVERED') { variant = 'default'; label = 'Đã giao'; }
            if (status === 'SHIPPED') { variant = 'secondary'; label = 'Đang giao'; }
            if (status === 'CANCELLED') { variant = 'destructive'; label = 'Đã hủy'; }
            if (status === 'PENDING') { variant = 'outline'; label = 'Chờ xử lý'; }

            return <Badge variant={variant}>{label}</Badge>;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Ngày đặt',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <OrderTableAction data={row.original} />,
    },
];
