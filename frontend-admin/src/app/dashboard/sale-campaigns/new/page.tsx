'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SaleCampaignForm } from '@/features/sale-campaigns/components';
import { saleCampaignService } from '@/lib/services/sale-campaign-service';
import { toast } from 'sonner';
import { CreateSaleCampaignRequest } from '@/types/sale-campaign';

export default function NewSaleCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        data: CreateSaleCampaignRequest,
        bannerFile?: File
    ) => {
        try {
            setLoading(true);
            const campaign = await saleCampaignService.create(data);

            if (bannerFile) {
                await saleCampaignService.uploadBanner(campaign.id, bannerFile);
            }

            toast.success('Tạo chiến dịch thành công');
            router.push(`/dashboard/sale-campaigns/${campaign.id}`);
        } catch (error) {
            console.error('Failed to create campaign:', error);
            toast.error('Tạo chiến dịch thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <Breadcrumbs />
                <div className="flex items-start justify-between">
                    <Heading
                        title="Tạo chiến dịch khuyến mãi"
                        description="Tạo chiến dịch giảm giá mới với các danh mục và khung giá"
                    />
                </div>
                <Separator />
                <SaleCampaignForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </PageContainer>
    );
}
