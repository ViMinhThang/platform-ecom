'use client';

import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductDetail } from "@/types/product";

interface ProductFeedbackProps {
    product: ProductDetail;
}

export const ProductFeedback = ({ product }: ProductFeedbackProps) => {
    return (
        <div className="w-full h-full">
            <ReviewList productId={product.id} />
        </div>
    );
};
