"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/StarRating";
import { useSession } from "next-auth/react";
import { createReview, createUnverifiedReview } from "@/lib/services/review-service";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchProductReviews } from "@/lib/store/slices/reviewSlice";
import { ReviewRichTextEditor } from "./review/ReviewRichTextEditor";
import { ReviewImageUploader } from "./review/ReviewImageUploader";

const reviewSchema = z.object({
    rating: z.number().min(1, "Vui lòng chọn số sao đánh giá").max(5),
    title: z.string().min(1, "Tiêu đề là bắt buộc").max(100, "Tiêu đề quá dài"),
    comment: z.string().min(10, "Nội dung đánh giá phải có ít nhất 10 ký tự").max(5000, "Nội dung đánh giá quá dài"),
    images: z.array(z.any()).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    productId: number;
    purchaseVerified?: boolean;
    orderId?: number;
}

export function ReviewForm({ productId, purchaseVerified = false, orderId }: ReviewFormProps) {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);

    // Form definition
    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            title: "",
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
            toast.error("Tài khoản của bạn thiếu thông tin email. Vui lòng cập nhật hồ sơ.");
            return;
        }

        setIsSubmitting(true);
        try {
            const images = data.images as File[];
            if (purchaseVerified && orderId) {
                await createReview({
                    productId,
                    orderId,
                    rating: data.rating,
                    title: data.title,
                    comment: data.comment,
                    email: session.user.email,
                }, session.accessToken, images);
            } else {
                await createUnverifiedReview({
                    productId,
                    rating: data.rating,
                    title: data.title,
                    comment: data.comment,
                    email: session.user.email,
                }, session.accessToken, images);
            }

            toast.success("Gửi đánh giá thành công!");
            setOpen(false);
            form.reset();
            setRating(0);

            // Refresh reviews
            dispatch(fetchProductReviews({ productId, params: { pageNumber: 0, pageSize: 10, sortBy: 'createdAt', sortDir: 'desc' } }));

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Need to manually handle rating since it's a custom component integration in the form
    const handleRatingChange = (value: number) => {
        setRating(value);
        form.setValue("rating", value, { shouldValidate: true });
    };

    if (!session) {
        return (
            <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vui lòng đăng nhập để viết đánh giá.</p>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Viết đánh giá</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Viết đánh giá</DialogTitle>
                    <DialogDescription>
                        Chia sẻ trải nghiệm của bạn về sản phẩm này.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Rating Field */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center space-y-2">
                                    <FormLabel>Đánh giá</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`text-2xl focus:outline-none transition-colors ${star <= (rating || field.value || 0) ? "text-primary" : "text-gray-300"
                                                        }`}
                                                    onClick={() => handleRatingChange(star)}
                                                    onMouseEnter={() => setRating(star)}
                                                    onMouseLeave={() => setRating(field.value || 0)}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tóm tắt trải nghiệm của bạn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung</FormLabel>
                                    <FormControl>
                                        <ReviewRichTextEditor
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Hãy cho chúng tôi biết bạn thích hoặc không thích điều gì..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình ảnh thực tế</FormLabel>
                                    <FormControl>
                                        <ReviewImageUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Bạn có thể tải lên tối đa 5 hình ảnh.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Gửi đánh giá
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
