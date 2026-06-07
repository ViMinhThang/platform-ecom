import { Metadata } from "next";
import { CategoryPageClient } from "./CategoryPageClient";

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

const CATEGORY_SLUG_LABELS: Record<string, string> = {
    electronics: "Đồ công nghệ",
    furniture: "Nội thất",
    clothing: "Thời trang",
    toys: "Đồ chơi",
    groceries: "Tạp hóa",
    books: "Sách",
    jewelry: "Trang sức",
    "beauty-products": "Sản phẩm làm đẹp",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const categoryName = CATEGORY_SLUG_LABELS[slug] ?? decodeURIComponent(slug).replace(/-/g, ' ');
    
    return {
        title: `${categoryName} | Sàn thương mại ACME`,
        description: `Khám phá các sản phẩm ${categoryName} được tuyển chọn trên sàn thương mại ACME.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    return <CategoryPageClient slug={slug} />;
}
