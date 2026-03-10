import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchProductReviews } from "@/lib/store/slices/reviewSlice";
import { createReview } from "@/lib/services/review-service";

const reviewSchema = z.object({
    rating: z.number().min(1, "Vui lòng chọn số sao đánh giá").max(5),

    comment: z
        .string()
        .min(10, "Nội dung đánh giá phải có ít nhất 10 ký tự")
        .max(5000, "Nội dung đánh giá quá dài"),
    images: z.array(z.any()).optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface UseReviewFormProps {
    productId: number;
    orderId?: number;
    onSuccess?: () => void;
}

export function useReviewForm({
    productId,
    orderId,
    onSuccess,
}: UseReviewFormProps) {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            images: [],
        },
    });

    const onSubmit = async (data: ReviewFormValues) => {
        if (!session?.accessToken) {
            toast.error("Bạn phải đăng nhập để viết đánh giá.");
            return;
        }

        if (!session.user?.email) {
            toast.error(
                "Tài khoản của bạn thiếu thông tin email. Vui lòng cập nhật hồ sơ."
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const images = data.images as File[];
            if (!orderId) {
                toast.error("Không tìm thấy đơn hàng.");
                setIsSubmitting(false);
                return;
            }

            await createReview(
                {
                    productId,
                    orderId,
                    rating: data.rating,
                    comment: data.comment,
                    email: session.user.email,
                },
                session.accessToken,
                images
            );

            toast.success("Gửi đánh giá thành công!");
            form.reset();

            // Refresh reviews
            dispatch(
                fetchProductReviews({
                    productId,
                    params: {
                        pageNumber: 0,
                        pageSize: 10,
                        sortBy: "createdAt",
                        sortDir: "desc",
                    },
                })
            );

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            // Safe access to error response
            const message = error?.response?.data?.message || "Gửi đánh giá thất bại";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        onSubmit: form.handleSubmit(onSubmit),
        session,
    };
}
