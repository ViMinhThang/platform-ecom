import { Metadata } from 'next';
import { getActiveSaleCampaigns, getSaleCampaignItems } from '@/lib/services/sale-campaign-service';
import { SaleCampaign } from '@/types/sale-campaign';
import { SaleCampaignPageClient } from './sale-campaign-page-client';
import { SaleCampaignDetailClient } from './[slug]/sale-campaign-detail-client';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const saleCampaigns = await getActiveSaleCampaigns();
        if (saleCampaigns.length > 0) {
            const campaign = saleCampaigns[0];
            return {
                title: `${campaign.name} - Sale Campaign`,
                description: campaign.description || 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
            };
        }
    } catch (error) {
        console.error('Failed to fetch metadata:', error);
    }

    return {
        title: 'Sale Campaigns - Siêu giảm giá',
        description: 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
    };
}

export default async function SaleCampaignsPage() {
    let saleCampaigns: SaleCampaign[] = [];
    let initialData = null;

    try {
        saleCampaigns = await getActiveSaleCampaigns();
        
        if (saleCampaigns.length > 0) {
            const firstCampaign = saleCampaigns[0];
            initialData = await getSaleCampaignItems(firstCampaign.slug, {
                page: 0,
                size: 24,
                sortBy: 'soldCount',
                sortOrder: 'desc'
            });
        }
    } catch (error) {
        console.error('Failed to fetch sale campaigns:', error);
    }

    if (saleCampaigns.length > 0 && initialData) {
        return (
            <SaleCampaignDetailClient 
                saleCampaign={saleCampaigns[0]} 
                initialData={initialData}
                isMainPage={true} 
            />
        );
    }

    return <SaleCampaignPageClient initialSaleCampaigns={saleCampaigns} />;
}
