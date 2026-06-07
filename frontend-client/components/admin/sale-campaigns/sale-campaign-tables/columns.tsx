'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Calendar, Tag, Text } from 'lucide-react';
import { SaleCampaign } from '@/types/sale-campaign';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { CellAction } from './cell-action';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    SCHEDULED: { label: 'Đã lên lịch', variant: 'outline' },
    ACTIVE: { label: 'Đang hoạt động', variant: 'default' },
    ENDED: { label: 'Đã kết thúc', variant: 'secondary' },
    COMPLETED: { label: 'Đã hoàn tất', variant: 'secondary' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
};

function ScheduleCell({ campaign }: { campaign: SaleCampaign }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    useEffect(() => {
        setStartDate(format(new Date(campaign.startTime), 'dd/MM/yyyy HH:mm', { locale: vi }));
        setEndDate(format(new Date(campaign.endTime), 'dd/MM/yyyy HH:mm', { locale: vi }));
    }, [campaign.startTime, campaign.endTime]);
    return (
        <div className="text-sm text-muted-foreground">
            <div>{startDate}</div>
            <div>→ {endDate}</div>
        </div>
    );
}

export const columns: ColumnDef<SaleCampaign>[] = [
    {
        id: 'banner',
        header: 'Ảnh bìa',
        cell: ({ row }) => {
            const campaign = row.original;
            const imageUrl = campaign.bannerUrl || '/placeholder.png';
            return (
                <div className="relative w-24 h-12">
                    <Image
                        src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080/uploads/${imageUrl}`}
                        alt={campaign.name}
                        fill
                        sizes="40px"
                        className="object-cover rounded-md border"
                    />
                </div>
            );
        },
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }: { column: Column<SaleCampaign, unknown> }) => (
            <DataTableColumnHeader column={column} title="Tên chiến dịch" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
        ),
        meta: {
            label: 'Tên',
            placeholder: 'Tìm kiếm...',
            variant: 'text',
            icon: Text,
        },
        enableColumnFilter: true,
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.original.status;
            const config = statusConfig[status] || { label: 'Không xác định', variant: 'secondary' as const };
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        id: 'categories',
        header: 'Danh mục',
        cell: ({ row }) => {
            const categories = row.original.categories || [];
            return (
                <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.categoryId} variant="outline" className="text-xs">
                            {cat.categoryName}
                        </Badge>
                    ))}
                    {categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{categories.length - 2}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        id: 'schedule',
        header: 'Thời gian',
        cell: ({ row }) => <ScheduleCell campaign={row.original} />,
    },
    {
        id: 'items',
        header: 'Sản phẩm',
        cell: ({ row }) => {
            const totalItems = row.original.totalItems || 0;
            return <Badge variant="secondary">{totalItems} SP</Badge>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
