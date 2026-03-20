'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SaleCampaign } from '@/types/sale-campaign';
import { saleCampaignService } from '@/lib/services/sale-campaign-service';
import { toast } from 'sonner';
import {
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Play,
    XCircle,
} from 'lucide-react';

interface CellActionProps {
    data: SaleCampaign;
}

export function CellAction({ data }: CellActionProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activateDialogOpen, setActivateDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await saleCampaignService.delete(data.id);
            toast.success('Đã xóa chiến dịch');
            router.refresh();
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleActivate = async () => {
        try {
            setLoading(true);
            await saleCampaignService.activate(data.id);
            toast.success('Đã kích hoạt chiến dịch');
            router.refresh();
        } catch (error) {
            toast.error('Kích hoạt thất bại');
        } finally {
            setLoading(false);
            setActivateDialogOpen(false);
        }
    };

    const handleCancel = async () => {
        try {
            setLoading(true);
            await saleCampaignService.cancel(data.id);
            toast.success('Đã hủy chiến dịch');
            router.refresh();
        } catch (error) {
            toast.error('Hủy thất bại');
        } finally {
            setLoading(false);
        }
    };

    const canEdit = data.status === 'DRAFT' || data.status === 'SCHEDULED';
    const canActivate = data.status === 'DRAFT';
    const canCancel = data.status === 'ACTIVE' || data.status === 'SCHEDULED';
    const canDelete = data.status === 'DRAFT' || data.status === 'CANCELLED';

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => router.push(`/admin/dashboard/sale-campaigns/${data.id}`)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>
                    {canEdit && (
                        <DropdownMenuItem
                            onClick={() => router.push(`/admin/dashboard/sale-campaigns/${data.id}/edit`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canActivate && (
                        <DropdownMenuItem onClick={() => setActivateDialogOpen(true)}>
                            <Play className="mr-2 h-4 w-4" />
                            Kích hoạt
                        </DropdownMenuItem>
                    )}
                    {canCancel && (
                        <DropdownMenuItem onClick={handleCancel} className="text-orange-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy chiến dịch
                        </DropdownMenuItem>
                    )}
                    {canDelete && (
                        <DropdownMenuItem
                            onClick={() => setDeleteDialogOpen(true)}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn xóa chiến dịch &quot;{data.name}&quot;? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={loading}>
                            {loading ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Activate Dialog */}
            <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kích hoạt chiến dịch</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kích hoạt sẽ tự động thêm sản phẩm từ các danh mục đã chọn. Bạn có chắc muốn kích hoạt &quot;{data.name}&quot;?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleActivate} disabled={loading}>
                            {loading ? 'Đang kích hoạt...' : 'Kích hoạt'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
