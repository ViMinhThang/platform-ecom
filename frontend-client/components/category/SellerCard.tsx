import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/utils/imageUrl";
interface SellerCardProps {
    id: string;
    name: string;
    image: string;
}

export function SellerCard({ id, name, image }: SellerCardProps) {
    return (
        <Link href={`/seller/${id}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={imageUrl.avatar(image)}
                    alt={name}
                    fill
                    className="object-cover transition-transform"
                />
            </div>
            <div className="mt-2">
                <h3 className="text-sm font-medium text-center truncate">{name}</h3>
            </div>
        </Link>
    );
}
