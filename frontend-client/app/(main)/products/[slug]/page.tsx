"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useGetProductBySlugQuery } from "@/lib/store/api/clientApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductEssentials } from "@/components/product/ProductEssentials";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { ProductFeedback } from "@/components/product/ProductFeedback";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductVariant } from "@/types/product";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = use(params);
    const { trackProductView } = useAnalytics();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [api, setApi] = useState<any>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    
    const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);

    useEffect(() => {
        const fetchSeller = async () => {
            if (product?.userId) {
                try {
                    const info = await getSellerInfo(product.userId);
                    setSeller(info);
                } catch (err) {
                    console.error("Failed to fetch seller info", err);
                }
            }
        };
        fetchSeller();
    }, [product?.userId]);

    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setCurrentImageIndex(api.selectedScrollSnap());
        });
    }, [api]);

    useEffect(() => {
        if (product) {
            trackProductView(product.id, undefined, product.cate.id, product.userId);
        }
    }, [product, trackProductView]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-labels italic text-foreground/40 animate-pulse">Đang truy xuất hồ sơ vật phẩm...</p>
            </div>
        );
    }

    if (isError || !product) {
        notFound();
    }

    const displayImage =
        selectedVariant?.imageUrl ||
        product.metadata?.imageUrl ||
        "https://placeholder.com/600";

    return (
        <div className="min-h-screen bg-background text-foreground font-labels antialiased">
            {/* TOP BAR / BREADCRUMBS: Sticky Registrar Gateway */}
            <div className="border-b border-foreground/10 bg-white/20 backdrop-blur-md sticky top-[72px] z-30 transition-all">
                <div className="container max-w-[1600px] mx-auto px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                        <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                        <span>/</span>
                        <Link href={`/category/${product.cate.slug}`} className="hover:text-primary transition-colors">{product.cate.name.toUpperCase()}</Link>
                        <span>/</span>
                        <span className="text-foreground truncate max-w-[300px]">{product.name.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-[1600px] mx-auto px-12 py-20 pb-40">
                {/* HERO SECTION: INTEGRATED DOSSIER LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-stretch">
                    {/* LEFT: GALLERY AREA */}
                    <div className="lg:col-span-7">
                        <ProductGallery
                            product={product}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            setApi={setApi}
                            api={api}
                            displayImage={displayImage}
                        />
                    </div>

                    {/* RIGHT: ESSENTIALS AREA */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary font-labels">
                                BỘ SƯU TẬP ACME
                            </span>
                            <h1 className="font-labels text-[56px] font-medium leading-none tracking-tighter text-foreground uppercase">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 font-labels">
                                <div className="flex items-center gap-1.5 text-primary">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <span className="pt-0.5">{product.totalReviews || 0} ĐÁNH GIÁ TỪ KHÁCH HÀNG</span>
                            </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-foreground/10">
                            <div className="font-labels font-bold text-4xl text-primary tracking-tighter">
                                {formatCurrency(selectedVariant?.salePrice || selectedVariant?.price || product.minPrice)}
                            </div>
                            <div className="inline-block px-5 py-2 bg-white/5 border border-foreground/10 rounded-sm">
                                <p className="text-[10px] font-bold text-foreground/40 font-labels uppercase tracking-widest">
                                    SẢN PHẨM CHÍNH HÃNG ACME
                                </p>
                            </div>
                        </div>

                        {/* SELLER CARD: MINIMAL ARCHIVAL IDENTITY */}
                        <div className="p-8 rounded-[4px] flex items-center gap-6 border border-foreground/10 bg-white/5 shadow-sm transition-all hover:bg-white/10">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-widest text-foreground">
                                    {seller?.username || `Thành viên #${product.userId}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-primary">4.9/5.0</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/30 font-labels">Uy tín</p>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-foreground/10">
                            <ProductEssentials
                                product={product}
                                setSelectedVariant={setSelectedVariant}
                            />
                        </div>
                    </div>
                </div>

                {/* DOSSIER SECTIONS: MONOLITHIC GRAY FLOW */}
                <div className="mt-40 space-y-40">
                    {/* PRODUCT DESCRIPTION SECTION */}
                    <section className="space-y-24 max-w-6xl mx-auto">
                        <div className="text-center space-y-6">
                            <h2 className="font-labels text-4xl font-bold tracking-tight uppercase text-foreground">Mô tả sản phẩm</h2>
                            <div className="h-px bg-primary/20 w-32 mx-auto" />
                        </div>
                        
                        <div className="prose prose-zinc prose-sm focus:outline-none max-w-none font-labels leading-relaxed text-foreground/80 text-xl selection:bg-primary/10
                            prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-foreground
                            prose-strong:text-foreground prose-strong:font-bold
                            prose-p:mb-12">
                            <div dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                        </div>
                    </section>

                    {/* SPECIFICATIONS SECTION */}
                    <section className="space-y-24">
                        <div className="text-center space-y-6">
                            <h2 className="font-labels text-4xl font-bold tracking-tight uppercase text-foreground">Thông số kỹ thuật</h2>
                            <div className="h-px bg-primary/20 w-32 mx-auto" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-20 max-w-6xl mx-auto w-full">
                            <ProductSpecifications product={product} />
                        </div>
                    </section>

                    {/* REVIEW SECTION: MATCHING GRAY CANVAS */}
                    <section className="pt-40 border-t border-foreground/10">
                        <ProductFeedback product={product} />
                    </section>

                    {/* RELATED PRODUCTS */}
                    <section className="space-y-24 pt-40 border-t border-foreground/10">
                        <div className="flex items-end justify-between px-2">
                            <div className="space-y-4 text-left">
                                <h2 className="font-labels text-4xl font-bold tracking-tighter uppercase text-foreground">Sản phẩm tương tự</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 font-labels">GỢI Ý DÀNH CHO BẠN</p>
                            </div>
                            <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1 font-labels hover:opacity-70 transition-all">Xem tất cả</Link>
                        </div>
                        <RelatedProducts productId={product.id} />
                    </section>
                </div>
            </div>
        </div>
    );
}
