import { Metadata } from 'next';
import { getActiveFlashSales, getFlashSaleItems } from '@/lib/services/flash-sale-service';
import { FlashSalePageClient } from './flash-sale-page-client';

export const metadata: Metadata = {
    title: 'Flash Sale - Siêu giảm giá',
    description: 'Khám phá các sản phẩm giảm giá sốc trong thời gian có hạn',
};

export default async function FlashSalesPage() {
    let flashSales = [];

    try {
        flashSales = await getActiveFlashSales();
    } catch (error) {
        console.error('Failed to fetch flash sales:', error);
    }

    return <FlashSalePageClient initialFlashSales={flashSales} />;
}
