'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash, Play, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/admin/alert-modal';
import { Voucher } from '@/types/voucher';
import { voucherService } from '@/lib/services/voucher-service';

interface CellActionProps {
    data: Voucher;
}

export function CellAction({ data }: CellActionProps) {
    const { push, refresh } = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const onEdit = () => {
        push(`/admin/dashboard/vouchers/${data.id}`);
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await voucherService.delete(data.id);
            toast.success('Đã xóa mã giảm giá');
            refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa mã giảm giá');
        } finally {
            setLoading(false);
            setDeleteOpen(false);
        }
    };

    const onActivate = async () => {
        try {
            setLoading(true);
            await voucherService.activate(data.id);
            toast.success('Đã kích hoạt mã giảm giá');
            refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi kích hoạt mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    const onCancel = async () => {
        try {
            setLoading(true);
            await voucherService.cancel(data.id);
            toast.success('Đã hủy mã giảm giá');
            refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi hủy mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    const canActivate = data.status === 'DRAFT' || data.status === 'SCHEDULED';
    const canCancel = data.status === 'ACTIVE' || data.status === 'SCHEDULED';

    return (
        <>
            <AlertModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 size-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    {canActivate && (
                        <DropdownMenuItem onClick={onActivate} disabled={loading}>
                            <Play className="mr-2 size-4" />
                            Kích hoạt
                        </DropdownMenuItem>
                    )}
                    {canCancel && (
                        <DropdownMenuItem onClick={onCancel} disabled={loading}>
                            <XCircle className="mr-2 size-4" />
                            Hủy
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600"
                    >
                        <Trash className="mr-2 size-4" />
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
