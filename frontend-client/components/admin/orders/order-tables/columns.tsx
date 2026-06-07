'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AdminOrderGroup } from '@/types/order/order';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getOrderStatusLabel, getPaymentStatusLabel } from '@/lib/utils/order-labels';
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
            const label = getPaymentStatusLabel(status);

            if (status === 'COMPLETED' || status === 'SUCCEEDED') variant = 'default';
            if (status === 'PENDING') variant = 'secondary';
            if (status === 'FAILED' || status === 'CANCELLED') variant = 'destructive';

            return <Badge variant={variant}>{label}</Badge>;
        },
    },
    {
        accessorKey: 'overallStatus',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.original.overallStatus;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
            const label = getOrderStatusLabel(status);

            if (status === 'DELIVERED' || status === 'COMPLETED') variant = 'default';
            if (status === 'SHIPPED' || status === 'DELIVERING' || status === 'PROCESSING') variant = 'secondary';
            if (status === 'CANCELLED' || status === 'DELIVERY_FAIL' || status === 'LOST' || status === 'DAMAGE') variant = 'destructive';
            if (status === 'PENDING') variant = 'outline';

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
