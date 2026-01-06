'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchFlashSaleById,
    activateFlashSale,
    cancelFlashSale,
    deleteFlashSale,
    addFlashSaleItems,
    removeFlashSaleItem,
    clearSelectedFlashSale,
} from '@/lib/store/slices/flashSaleSlice';
import { FlashSaleStatusBadge, FlashSaleItemPicker } from '@/features/flash-sales';
import { AddFlashSaleItemRequest } from '@/types/flash-sale';
import { ArrowLeft, Zap, Edit, Play, X, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertModal } from '@/components/modal/alert-modal';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FlashSaleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const flashSaleId = Number(params.id);

    const { selectedFlashSale: flashSale, loading, mutationLoading, error } = useAppSelector(
        (state) => state.flashSales
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchFlashSaleById(flashSaleId));
        return () => {
            dispatch(clearSelectedFlashSale());
        };
    }, [dispatch, flashSaleId]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!flashSale) {
        return <div className="p-8 text-center text-destructive">Flash sale not found</div>;
    }

    const handleActivate = async () => {
        try {
            await dispatch(activateFlashSale(flashSaleId)).unwrap();
            toast.success('Flash sale activated successfully');
        } catch {
            toast.error('Failed to activate flash sale');
        }
    };

    const handleCancel = async () => {
        try {
            await dispatch(cancelFlashSale(flashSaleId)).unwrap();
            toast.success('Flash sale cancelled successfully');
        } catch {
            toast.error('Failed to cancel flash sale');
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteFlashSale(flashSaleId)).unwrap();
            toast.success('Flash sale deleted successfully');
            router.push('/dashboard/flash-sales');
        } catch {
            toast.error('Failed to delete flash sale');
        }
        setShowDeleteModal(false);
    };

    const handleAddItems = async (items: AddFlashSaleItemRequest[]) => {
        try {
            await dispatch(addFlashSaleItems({ id: flashSaleId, items })).unwrap();
            toast.success('Items added successfully');
        } catch {
            toast.error('Failed to add items');
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await dispatch(removeFlashSaleItem({ flashSaleId, itemId })).unwrap();
            toast.success('Item removed successfully');
        } catch {
            toast.error('Failed to remove item');
        }
    };

    const canActivate = flashSale.status === 'DRAFT';
    const canCancel = flashSale.status === 'ACTIVE' || flashSale.status === 'SCHEDULED';
    const canEdit = flashSale.status !== 'ACTIVE';
    const canDelete = flashSale.status !== 'ACTIVE';

    return (
        <div className="space-y-6">
            <AlertModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                loading={mutationLoading}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="rounded-none border-2 border-black">
                        <Link href="/dashboard/flash-sales">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-white">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-wider">{flashSale.name}</h1>
                            <FlashSaleStatusBadge status={flashSale.status} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {canEdit && (
                        <Button asChild variant="outline" className="rounded-none border-2 border-black">
                            <Link href={`/dashboard/flash-sales/${flashSaleId}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    )}
                    {canActivate && (
                        <Button onClick={handleActivate} className="rounded-none bg-green-600 text-white" disabled={mutationLoading}>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                        </Button>
                    )}
                    {canCancel && (
                        <Button onClick={handleCancel} variant="outline" className="rounded-none" disabled={mutationLoading}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    )}
                    {canDelete && (
                        <Button onClick={() => setShowDeleteModal(true)} variant="destructive" className="rounded-none" disabled={mutationLoading}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Details Card */}
            <Card className="border-2 border-black rounded-none">
                <CardHeader className="border-b-2 border-black bg-zinc-100">
                    <CardTitle className="text-lg font-black uppercase tracking-wider">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs font-bold uppercase text-muted-foreground">Start Time</div>
                        <div className="font-mono text-lg">{format(new Date(flashSale.startTime), 'dd/MM/yyyy HH:mm')}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-muted-foreground">End Time</div>
                        <div className="font-mono text-lg">{format(new Date(flashSale.endTime), 'dd/MM/yyyy HH:mm')}</div>
                    </div>
                    {flashSale.description && (
                        <div className="col-span-2">
                            <div className="text-xs font-bold uppercase text-muted-foreground">Description</div>
                            <div className="text-sm">{flashSale.description}</div>
                        </div>
                    )}
                    {flashSale.status === 'ACTIVE' && flashSale.remainingSeconds > 0 && (
                        <div className="col-span-2 p-4 bg-primary/10 border-2 border-primary">
                            <div className="text-xs font-bold uppercase text-primary">Time Remaining</div>
                            <div className="text-2xl font-black font-mono text-primary">
                                {Math.floor(flashSale.remainingSeconds / 3600)}h{' '}
                                {Math.floor((flashSale.remainingSeconds % 3600) / 60)}m{' '}
                                {flashSale.remainingSeconds % 60}s
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Items */}
            <FlashSaleItemPicker
                flashSaleId={flashSaleId}
                existingItems={flashSale.items || []}
                onAddItems={handleAddItems}
                onRemoveItem={handleRemoveItem}
            />
        </div>
    );
}
