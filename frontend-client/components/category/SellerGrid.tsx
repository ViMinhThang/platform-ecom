import { SellerCard } from "./SellerCard";

// Mock data for sellers
const MOCK_SELLERS = [
    { id: "1", name: "Tech World", imageUrl: "https://placehold.co/400x400/png?text=Tech" },
    { id: "2", name: "Fashion Hub", imageUrl: "https://placehold.co/400x400/png?text=Fashion" },
    { id: "3", name: "Home Decor", imageUrl: "https://placehold.co/400x400/png?text=Home" },
    { id: "4", name: "Sports Gear", imageUrl: "https://placehold.co/400x400/png?text=Sports" },
    { id: "5", name: "Beauty Plus", imageUrl: "https://placehold.co/400x400/png?text=Beauty" },
    { id: "6", name: "Kids Corner", imageUrl: "https://placehold.co/400x400/png?text=Kids" },
];

export function SellerGrid() {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Top Sellers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {MOCK_SELLERS.map((seller) => (
                    <SellerCard
                        key={seller.id}
                        id={seller.id}
                        name={seller.name}
                        imageUrl={seller.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}
