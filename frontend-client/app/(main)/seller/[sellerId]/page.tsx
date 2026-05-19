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
            title: `${seller.username} Store | Antigravity E-com`,
            description: `Shop high-quality products from ${seller.username} on Antigravity E-commerce platform.`,
        };
    } catch {
        return {
            title: 'Seller Store | Antigravity E-com',
        };
    }
}

export default async function SellerStorePage({ params }: SellerStorePageProps) {
    const { sellerId } = await params;
    return <SellerStorePageClient sellerId={sellerId} />;
}
