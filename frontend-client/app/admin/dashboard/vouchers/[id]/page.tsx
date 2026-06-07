'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { VoucherForm } from '@/components/admin/vouchers/voucher-form';
import { voucherService } from '@/lib/services/admin/voucher-service';
import { Voucher } from '@/types/voucher';
import { Skeleton } from '@/components/ui/skeleton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditVoucherPage({ params }: PageProps) {
    const { id } = use(params);
    const { push, refresh } = useRouter();
    const [loading, setLoading] = useState(false);
    const [voucher, setVoucher] = useState<Voucher | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const data = await voucherService.getById(parseInt(id));
                setVoucher(data);
            } catch (error) {
                toast.error('Không tìm thấy mã giảm giá');
                push('/admin/dashboard/vouchers');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchVoucher();
    }, [id, push]);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            await voucherService.update(parseInt(id), {
                ...data,
                startTime: new Date(data.startTime).toISOString(),
                endTime: new Date(data.endTime).toISOString(),
            });
            toast.success('Cập nhật mã giảm giá thành công');
            push('/admin/dashboard/vouchers');
            refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <PageContainer scrollable>
                <div className="flex flex-1 flex-col gap-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Separator />
                    <div className="grid gap-6 md:grid-cols-2">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                </div>
            </PageContainer>
        );
    }

    if (!voucher) {
        return null;
    }

    return (
        <PageContainer scrollable>
            <div className="flex flex-1 flex-col gap-y-4">
                <Heading
                    title="Chỉnh sửa mã giảm giá"
                    description={`Cập nhật thông tin mã giảm giá: ${voucher.name}`}
                />
                <Separator />
                <VoucherForm voucher={voucher} onSubmit={handleSubmit} loading={loading} />
            </div>
        </PageContainer>
    );
}
