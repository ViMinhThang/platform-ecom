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
import { AlertModal } from '@/components/modal/alert-modal';
import { Voucher } from '@/types/voucher';
import { voucherService } from '@/lib/services/voucher-service';

interface CellActionProps {
    data: Voucher;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const onEdit = () => {
        router.push(`/admin/dashboard/vouchers/${data.id}`);
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await voucherService.delete(data.id);
            toast.success('Đã xóa voucher');
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa voucher');
        } finally {
            setLoading(false);
            setDeleteOpen(false);
        }
    };

    const onActivate = async () => {
        try {
            setLoading(true);
            await voucherService.activate(data.id);
            toast.success('Đã kích hoạt voucher');
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi kích hoạt voucher');
        } finally {
            setLoading(false);
        }
    };

    const onCancel = async () => {
        try {
            setLoading(true);
            await voucherService.cancel(data.id);
            toast.success('Đã hủy voucher');
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi hủy voucher');
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
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    {canActivate && (
                        <DropdownMenuItem onClick={onActivate} disabled={loading}>
                            <Play className="mr-2 h-4 w-4" />
                            Kích hoạt
                        </DropdownMenuItem>
                    )}
                    {canCancel && (
                        <DropdownMenuItem onClick={onCancel} disabled={loading}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
