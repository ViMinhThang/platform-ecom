'use client';

interface RelatedProductsProps {
    productId: number;
}

export const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    return (
        <div className="mt-16 border-t pt-12 max-w-5xl mx-auto">
            <h2 className="text-lg font-black mb-4 uppercase tracking-widest">Sản phẩm liên quan</h2>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Các sản phẩm liên quan sẽ được hiển thị ở đây</p>
        </div>
    );
};
