'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useReview } from '@/hooks/useReview';
import { FormField } from '@/components/common/form/FormField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const reviewSchema = z.object({
    rating: z.number().min(1, 'Vui lòng chọn số sao đánh giá').max(5),
    title: z.string().optional(),
    comment: z.string().min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface UnverifiedReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    onSuccess?: () => void;
}


export function UnverifiedReviewDialog({
    open,
    onOpenChange,
    productId,
    onSuccess
}: UnverifiedReviewDialogProps) {
    const { data: session } = useSession();
    const [hoveredRating, setHoveredRating] = useState(0);
    const { submitUnverifiedReview, isSubmitting } = useReview();

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            title: '',
            comment: '',
        },
    });

    const selectedRating = form.watch('rating');

    const handleSubmit = async (data: ReviewFormValues) => {
        if (!session?.user?.email) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá.");
            return;
        }

        try {
            await submitUnverifiedReview({
                productId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                email: session.user.email,
            });
            onOpenChange(false);
            form.reset();
            onSuccess?.();
            toast.success("Gửi đánh giá thành công!");
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Viết đánh giá</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>Đánh giá *</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => form.setValue('rating', star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || selectedRating)
                                            ? 'fill-primary text-primary'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {form.formState.errors.rating && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.rating.message}
                            </p>
                        )}
                    </div>

                    {/* Title (Optional) */}
                    <FormField
                        label="Tiêu đề (Tùy chọn)"
                        id="title"
                        registration={form.register('title')}
                        error={form.formState.errors.title}
                        placeholder="Tóm tắt đánh giá của bạn trong vài từ"
                    />

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Nội dung đánh giá *</Label>
                        <Textarea
                            id="comment"
                            {...form.register('comment')}
                            placeholder="Chia sẻ suy nghĩ của bạn về sản phẩm này..."
                            rows={4}
                            className="resize-none"
                        />
                        {form.formState.errors.comment && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.comment.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Gửi đánh giá
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
