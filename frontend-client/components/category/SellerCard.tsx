import Image from "next/image";
import Link from "next/link";

interface SellerCardProps {
    id: string;
    name: string;
    imageUrl: string;
}

export function SellerCard({ id, name, imageUrl }: SellerCardProps) {
    return (
        <Link href={`/seller/${id}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="mt-2">
                <h3 className="text-sm font-medium text-center truncate">{name}</h3>
            </div>
        </Link>
    );
}
