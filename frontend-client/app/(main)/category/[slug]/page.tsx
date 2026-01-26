import { Metadata } from "next";
import { CategoryPageClient } from "./CategoryPageClient";

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const categoryName = decodeURIComponent(slug).replace(/-/g, ' ');
    
    return {
        title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} | Antigravity E-com`,
        description: `Browse the best selection of ${categoryName} products on Antigravity E-commerce platform.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    return <CategoryPageClient slug={slug} />;
}
