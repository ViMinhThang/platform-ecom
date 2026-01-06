import { Metadata } from 'next';
import { getFlashSaleBySlug, getFlashSaleItems } from '@/lib/services/flash-sale-service';
import { notFound } from 'next/navigation';
import { FlashSaleDetailClient } from './flash-sale-detail-client';

interface FlashSaleDetailPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: FlashSaleDetailPageProps): Promise<Metadata> {
    try {
        const flashSale = await getFlashSaleBySlug(params.slug);
        return {
            title: `${flashSale.name} - Flash Sale`,
            description: flashSale.description || `Siêu giảm giá ${flashSale.name}`,
        };
    } catch {
        return {
            title: 'Flash Sale không tìm thấy',
        };
    }
}

export default async function FlashSaleDetailPage({ params }: FlashSaleDetailPageProps) {
    try {
        const flashSale = await getFlashSaleBySlug(params.slug);
        const items = await getFlashSaleItems(params.slug, 50);

        return <FlashSaleDetailClient flashSale={flashSale} items={items} />;
    } catch (error) {
        console.error('Failed to fetch flash sale:', error);
        notFound();
    }
}
