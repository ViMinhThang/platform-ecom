'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SaleCampaignForm } from '@/components/admin/sale-campaigns/sale-campaign-form';
import { saleCampaignService } from '@/lib/services/sale-campaign-service';
import { toast } from 'sonner';
import { SaleCampaign, UpdateSaleCampaignRequest } from '@/types/sale-campaign';
import Link from 'next/link';

export default function EditSaleCampaignPage() {
    const params = useParams();
    const { push } = useRouter();
    const campaignId = Number(params.id);

    const [campaign, setCampaign] = useState<SaleCampaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await saleCampaignService.getById(campaignId);
                setCampaign(data);
            } catch (error) {
                console.error('Failed to fetch campaign:', error);
                toast.error('Không thể tải chiến dịch');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [campaignId]);

    if (loading) {
        return <div className="p-8 text-center">Đang tải…</div>;
    }

    if (!campaign) {
        return <div className="p-8 text-center text-destructive">Không tìm thấy chiến dịch</div>;
    }

    if (campaign.status === 'ACTIVE') {
        return (
            <PageContainer scrollable={false}>
                <div className="flex flex-col h-full items-center justify-center gap-y-4">
                    <p className="text-destructive font-medium">
                        Không thể chỉnh sửa chiến dịch đang hoạt động
                    </p>
                    <Button asChild variant="outline">
                        <Link href={`/admin/dashboard/sale-campaigns/${campaignId}`}>Quay lại</Link>
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const handleSubmit = async (
        data: UpdateSaleCampaignRequest & { categoryIds?: number[]; discountTiers?: any[] },
        bannerFile?: File
    ) => {
        try {
            setSaving(true);

            await saleCampaignService.update(campaignId, {
                name: data.name,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
            });

            if (data.categoryIds) {
                await saleCampaignService.updateCategories(campaignId, data.categoryIds);
            }

            if (data.discountTiers) {
                await saleCampaignService.updateDiscountTiers(campaignId, data.discountTiers);
            }

            if (bannerFile) {
                await saleCampaignService.uploadBanner(campaignId, bannerFile);
            }

            toast.success('Cập nhật thành công');
            push(`/admin/dashboard/sale-campaigns/${campaignId}`);
        } catch (error) {
            console.error('Failed to update campaign:', error);
            toast.error('Cập nhật thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <Breadcrumbs />
                <div className="flex items-start justify-between">
                    <Heading
                        title="Chỉnh sửa chiến dịch"
                        description={`Chỉnh sửa thông tin cho ${campaign.name}`}
                    />
                </div>
                <Separator />
                <SaleCampaignForm campaign={campaign} onSubmit={handleSubmit} loading={saving} />
            </div>
        </PageContainer>
    );
}
