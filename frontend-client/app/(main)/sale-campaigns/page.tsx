import { Metadata } from 'next';
import { getActiveSaleCampaigns, getSaleCampaignItems } from '@/lib/services/sale-campaign-service';
import { SaleCampaign } from '@/types/sale-campaign';
import { SaleCampaignPageClient } from './sale-campaign-page-client';
import { SaleCampaignDetailClient } from './[slug]/sale-campaign-detail-client';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const saleCampaigns = await getActiveSaleCampaigns();
        if (saleCampaigns.length > 0) {
            const campaign = saleCampaigns[0];
            return {
                title: `${campaign.name} - Chiến dịch khuyến mãi`,
                description: campaign.description || 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
            };
        }
    } catch (error) {
        console.error('Failed to fetch metadata:', error);
    }

    return {
        title: 'Chiến dịch khuyến mãi - Siêu giảm giá',
        description: 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
    };
}

function LoadingState() {
    return (
        <div className="container mx-auto py-8">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
                <div className="h-64 bg-zinc-200 rounded"></div>
            </div>
        </div>
    );
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
            <Suspense fallback={<LoadingState />}>
                <SaleCampaignDetailClient 
                    saleCampaign={saleCampaigns[0]} 
                    initialData={initialData}
                    isMainPage={true} 
                />
            </Suspense>
        );
    }

    return <SaleCampaignPageClient initialSaleCampaigns={saleCampaigns} />;
}
