'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchFlashSales,
    deleteFlashSale,
    activateFlashSale,
    cancelFlashSale,
} from '@/lib/store/slices/flashSaleSlice';
import { getFlashSaleColumns, FlashSaleTable } from '@/features/flash-sales';
import { Button } from '@/components/ui/button';
import { Plus, Zap } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FlashSalesPage() {
    const dispatch = useAppDispatch();
    const { items, loading, mutationLoading, pagination, error } = useAppSelector(
        (state) => state.flashSales
    );

    const [page, setPage] = useState(0);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchFlashSales({ page, size: 10 }));
    }, [dispatch, page]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await dispatch(deleteFlashSale(deleteId)).unwrap();
                toast.success('Flash sale deleted successfully');
            } catch {
                toast.error('Failed to delete flash sale');
            }
            setDeleteId(null);
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await dispatch(activateFlashSale(id)).unwrap();
            toast.success('Flash sale activated successfully');
        } catch {
            toast.error('Failed to activate flash sale');
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await dispatch(cancelFlashSale(id)).unwrap();
            toast.success('Flash sale cancelled successfully');
        } catch {
            toast.error('Failed to cancel flash sale');
        }
    };

    const columns = getFlashSaleColumns({
        onDelete: setDeleteId,
        onActivate: handleActivate,
        onCancel: handleCancel,
    });

    return (
        <div className="space-y-6">
            <AlertModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                loading={mutationLoading}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-wider">Flash Sales</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage time-limited flash sale campaigns
                        </p>
                    </div>
                </div>
                <Button asChild className="bg-black text-white rounded-none font-bold">
                    <Link href="/dashboard/flash-sales/new">
                        <Plus className="mr-2 h-4 w-4" />
                        NEW FLASH SALE
                    </Link>
                </Button>
            </div>

            <div className="border-2 border-black bg-white p-4">
                <FlashSaleTable
                    columns={columns}
                    data={items}
                    loading={loading}
                    pageCount={pagination.totalPages}
                    pageNo={page}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
