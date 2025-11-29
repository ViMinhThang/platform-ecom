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
import { Star, Loader2 } from 'lucide-react';

const reviewSchema = z.object({
    rating: z.number().min(1, 'Please select a rating').max(5),
    title: z.string().optional(),
    comment: z.string().min(10, 'Review must be at least 10 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    orderId: number;
    onSuccess?: () => void;
}

/**
 * Dialog component for submitting product reviews.
 */
export function ReviewDialog({
    open,
    onOpenChange,
    productId,
    orderId,
    onSuccess
}: ReviewDialogProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const { submitReview, isSubmitting } = useReview();

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
        try {
            await submitReview({
                productId,
                orderId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
            });
            onOpenChange(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>Rating *</Label>
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
                                            ? 'fill-yellow-400 text-yellow-400'
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
                        label="Title (Optional)"
                        id="title"
                        registration={form.register('title')}
                        error={form.formState.errors.title}
                        placeholder="Sum up your review in a few words"
                    />

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                            id="comment"
                            {...form.register('comment')}
                            placeholder="Share your thoughts about this product..."
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
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
