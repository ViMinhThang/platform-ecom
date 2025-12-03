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
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'groupNumber',
        header: 'Order Number',
        cell: ({ row }) => <span className="font-medium">{row.original.groupNumber}</span>,
    },
    {
        accessorKey: 'userName',
        header: 'Customer',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.userName}</span>
                <span className="text-xs text-muted-foreground">{row.original.userEmail}</span>
            </div>
        ),
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total',
        cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },
    {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

            if (status === 'COMPLETED') variant = 'default'; // Green-ish usually
            if (status === 'PENDING') variant = 'secondary';
            if (status === 'FAILED') variant = 'destructive';

            return <Badge variant={variant}>{status}</Badge>;
        },
    },
    {
        accessorKey: 'overallStatus',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.overallStatus;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

            if (status === 'DELIVERED') variant = 'default';
            if (status === 'SHIPPED') variant = 'secondary';
            if (status === 'CANCELLED') variant = 'destructive';
            if (status === 'PENDING') variant = 'outline';

            return <Badge variant={variant}>{status}</Badge>;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <OrderTableAction data={row.original} />,
    },
];
