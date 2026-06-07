import { Metadata } from "next";
import { SellerStorePageClient } from "./SellerStorePageClient";
import { getSellerInfo } from "@/lib/services/user-service";

interface SellerStorePageProps {
    params: Promise<{ sellerId: string }>;
}

export async function generateMetadata({ params }: SellerStorePageProps): Promise<Metadata> {
    const { sellerId } = await params;
    try {
        const seller = await getSellerInfo(Number(sellerId));
        return {
            title: `${seller.username} | Sàn thương mại ACME`,
            description: `Mua sắm sản phẩm chất lượng cao từ ${seller.username} trên sàn thương mại ACME.`,
        };
    } catch {
        return {
            title: 'Cửa hàng người bán | Sàn thương mại ACME',
        };
    }
}

export default async function SellerStorePage({ params }: SellerStorePageProps) {
    const { sellerId } = await params;
    return <SellerStorePageClient sellerId={sellerId} />;
}
