import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCreateReviewMutation } from "@/lib/store/api/clientApi";

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
    const [createReviewMutation, { isLoading: isSubmitting }] = useCreateReviewMutation();

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            images: [],
        },
    });

    const onSubmit = async (data: ReviewFormValues) => {
        if (!session?.user?.email) {
            toast.error(
                "Tài khoản của bạn thiếu thông tin email. Vui lòng cập nhật hồ sơ."
            );
            return;
        }

        if (!orderId) {
            toast.error("Không tìm thấy đơn hàng.");
            return;
        }

        try {
            const images = data.images as File[];
            await createReviewMutation({
                productId,
                orderId,
                rating: data.rating,
                comment: data.comment,
                email: session.user.email,
            }).unwrap();

            toast.success("Gửi đánh giá thành công!");
            form.reset();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: unknown) {
            const message = (error as Error).message || "Gửi đánh giá thất bại";
            toast.error(message);
        }
    };

    return {
        form,
        isSubmitting,
        onSubmit: form.handleSubmit(onSubmit),
        session,
    };
}
