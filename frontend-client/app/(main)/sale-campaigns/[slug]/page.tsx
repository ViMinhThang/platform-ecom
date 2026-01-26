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
    let saleCampaign = null;
    let initialData = null;

    try {
        saleCampaign = await getSaleCampaignBySlug(params.slug);
        // Fetch first page of items (24 items)
        initialData = await getSaleCampaignItems(params.slug, {
            page: 0,
            size: 24,
            sortBy: 'soldCount',
            sortOrder: 'desc'
        });
    } catch (error) {
        console.error('Failed to fetch sale campaign:', error);
    }

    if (!saleCampaign || !initialData) {
        notFound();
    }

    return <SaleCampaignDetailClient saleCampaign={saleCampaign} initialData={initialData} />;
}
