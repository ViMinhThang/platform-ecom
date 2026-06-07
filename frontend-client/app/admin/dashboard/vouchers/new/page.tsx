'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { VoucherForm } from '@/components/admin/vouchers/voucher-form';
import { voucherService } from '@/lib/services/admin/voucher-service';

export default function NewVoucherPage() {
    const { push, refresh } = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            await voucherService.create({
                ...data,
                startTime: new Date(data.startTime).toISOString(),
                endTime: new Date(data.endTime).toISOString(),
            });
            toast.success('Tạo mã giảm giá thành công');
            push('/admin/dashboard/vouchers');
            refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer scrollable>
            <div className="flex flex-1 flex-col gap-y-4">
                <Heading
                    title="Tạo mã giảm giá mới"
                    description="Thêm mã giảm giá mới vào hệ thống"
                />
                <Separator />
                <VoucherForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </PageContainer>
    );
}
