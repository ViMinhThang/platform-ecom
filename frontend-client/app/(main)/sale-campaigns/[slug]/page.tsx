import { Metadata } from 'next';
import { getSaleCampaignBySlug, getSaleCampaignItems } from '@/lib/services/sale-campaign-service';
import { notFound } from 'next/navigation';
import { SaleCampaignDetailClient } from './sale-campaign-detail-client';

interface SaleCampaignDetailPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: SaleCampaignDetailPageProps): Promise<Metadata> {
    try {
        const saleCampaign = await getSaleCampaignBySlug(params.slug);
        return {
            title: `${saleCampaign.name} - Sale Campaign`,
            description: saleCampaign.description || `Siêu giảm giá ${saleCampaign.name}`,
        };
    } catch {
        return {
            title: 'Sale Campaign không tìm thấy',
        };
    }
}

export default async function SaleCampaignDetailPage({ params }: SaleCampaignDetailPageProps) {
    try {
        const saleCampaign = await getSaleCampaignBySlug(params.slug);
        const items = await getSaleCampaignItems(params.slug, 50);

        return <SaleCampaignDetailClient saleCampaign={saleCampaign} items={items} />;
    } catch (error) {
        console.error('Failed to fetch sale campaign:', error);
        notFound();
    }
}
