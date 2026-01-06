'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { createFlashSale } from '@/lib/store/slices/flashSaleSlice';
import { FlashSaleForm } from '@/features/flash-sales';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewFlashSalePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { mutationLoading } = useAppSelector((state) => state.flashSales);

    const handleSubmit = async (data: { name: string; description?: string; bannerUrl?: string; startTime: string; endTime: string }) => {
        try {
            const result = await dispatch(createFlashSale(data)).unwrap();
            toast.success('Flash sale created successfully');
            router.push(`/dashboard/flash-sales/${result.id}`);
        } catch {
            toast.error('Failed to create flash sale');
        }
    };

    return (
        <div className="space-y-6">
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
                    <h1 className="text-2xl font-black uppercase tracking-wider">New Flash Sale</h1>
                </div>
            </div>

            <FlashSaleForm onSubmit={handleSubmit} loading={mutationLoading} />
        </div>
    );
}
