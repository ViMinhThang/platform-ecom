import Image from "next/image";
import Link from "next/link";
import { Store, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/utils/imageUrl";

interface SellerInfoCardProps {
    sellerId: number;
    sellerName?: string;
    sellerImage?: string;
}

export function SellerInfoCard({
    sellerId,
    sellerName = "Unknown Seller",
    sellerImage,
}: SellerInfoCardProps) {
    return (
        <div className="border rounded-lg p-4 space-y-4 sticky top-24">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Seller Information
            </h3>

            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative flex-shrink-0">
                    {sellerImage ? (
                        <Image
                            src={imageUrl.avatar(sellerImage)}
                            alt={sellerName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-lg font-semibold">
                            {sellerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-medium truncate">{sellerName}</p>
                    <p className="text-xs text-muted-foreground">Seller ID: {sellerId}</p>
                </div>
            </div>

            <div className="space-y-2">
                <Link href={`/seller/${sellerId}`} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                        <Store className="w-4 h-4" />
                        Visit Store
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Seller
                </Button>
            </div>
        </div>
    );
}
