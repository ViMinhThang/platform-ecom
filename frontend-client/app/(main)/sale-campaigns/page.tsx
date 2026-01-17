import { Metadata } from 'next';
import { getActiveSaleCampaigns } from '@/lib/services/sale-campaign-service';
import { SaleCampaignPageClient } from './sale-campaign-page-client';

export const metadata: Metadata = {
    title: 'Sale Campaigns - Siêu giảm giá',
    description: 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
};

export default async function SaleCampaignsPage() {
    let saleCampaigns = [];

    try {
        saleCampaigns = await getActiveSaleCampaigns();
    } catch (error) {
        console.error('Failed to fetch sale campaigns:', error);
    }

    return <SaleCampaignPageClient initialSaleCampaigns={saleCampaigns} />;
}
