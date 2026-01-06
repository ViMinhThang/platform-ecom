'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchFlashSaleById, updateFlashSale, clearSelectedFlashSale } from '@/lib/store/slices/flashSaleSlice';
import { FlashSaleForm } from '@/features/flash-sales';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditFlashSalePage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const flashSaleId = Number(params.id);

    const { selectedFlashSale: flashSale, loading, mutationLoading } = useAppSelector(
        (state) => state.flashSales
    );

    useEffect(() => {
        dispatch(fetchFlashSaleById(flashSaleId));
        return () => {
            dispatch(clearSelectedFlashSale());
        };
    }, [dispatch, flashSaleId]);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!flashSale) {
        return <div className="p-8 text-center text-destructive">Flash sale not found</div>;
    }

    if (flashSale.status === 'ACTIVE') {
        return (
            <div className="p-8 text-center">
                <p className="text-destructive">Cannot edit an active flash sale</p>
                <Button asChild className="mt-4">
                    <Link href={`/dashboard/flash-sales/${flashSaleId}`}>Go Back</Link>
                </Button>
            </div>
        );
    }

    const handleSubmit = async (data: { name: string; description?: string; bannerUrl?: string; startTime: string; endTime: string }) => {
        try {
            await dispatch(updateFlashSale({ id: flashSaleId, data })).unwrap();
            toast.success('Flash sale updated successfully');
            router.push(`/dashboard/flash-sales/${flashSaleId}`);
        } catch {
            toast.error('Failed to update flash sale');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm" className="rounded-none border-2 border-black">
                    <Link href={`/dashboard/flash-sales/${flashSaleId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-wider">Edit Flash Sale</h1>
                </div>
            </div>

            <FlashSaleForm flashSale={flashSale} onSubmit={handleSubmit} loading={mutationLoading} />
        </div>
    );
}
