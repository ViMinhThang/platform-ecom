'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const VND_FORMATTER = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
import {
    Voucher,
    VoucherStatus,
    VOUCHER_TYPE_LABELS,
    VOUCHER_CATEGORY_LABELS,
    VOUCHER_STATUS_LABELS,
    APPLY_MODE_LABELS,
} from '@/types/voucher';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { CellAction } from './cell-action';

const statusColors: Record<VoucherStatus, string> = {
    DRAFT: 'bg-gray-500',
    SCHEDULED: 'bg-blue-500',
    ACTIVE: 'bg-green-500',
    EXPIRED: 'bg-yellow-500',
    CANCELLED: 'bg-red-500',
};

function ScheduleCell({ startTime, endTime }: { startTime: string; endTime: string }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    useEffect(() => {
        try {
            setStartDate(format(new Date(startTime), 'dd/MM/yyyy HH:mm', { locale: vi }));
            setEndDate(format(new Date(endTime), 'dd/MM/yyyy HH:mm', { locale: vi }));
        } catch (e) {
            // fallback stays empty
        }
    }, [startTime, endTime]);
    if (!startDate) return <span className="text-red-500">Lỗi ngày tháng</span>;
    return (
        <div className="text-xs">
            <div>{startDate}</div>
            <div className="text-muted-foreground">→ {endDate}</div>
        </div>
    );
}

export const columns: ColumnDef<Voucher>[] = [
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
                aria-label="Chọn dòng"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Tên mã giảm giá',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                {row.original.code && (
                    <code className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                        {row.original.code}
                    </code>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Loại',
        cell: ({ row }) => VOUCHER_TYPE_LABELS[row.original.type],
    },
    {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => (
            <Badge variant="outline">
                {VOUCHER_CATEGORY_LABELS[row.original.category]}
            </Badge>
        ),
    },
    {
        accessorKey: 'discountValue',
        header: 'Giảm giá',
        cell: ({ row }) => {
            const { type, discountValue } = row.original;
            return type === 'PERCENTAGE'
                ? `${discountValue}%`
                : VND_FORMATTER.format(discountValue);
        },
    },
    {
        accessorKey: 'applyMode',
        header: 'Chế độ',
        cell: ({ row }) => APPLY_MODE_LABELS[row.original.applyMode],
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
            <Badge className={statusColors[row.original.status]}>
                {VOUCHER_STATUS_LABELS[row.original.status]}
            </Badge>
        ),
    },
    {
        accessorKey: 'startTime',
        header: 'Thời gian',
        cell: ({ row }) => <ScheduleCell startTime={row.original.startTime} endTime={row.original.endTime} />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
