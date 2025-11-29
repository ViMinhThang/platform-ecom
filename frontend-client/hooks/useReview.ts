import { useState } from 'react';
import { createReview, CreateReviewPayload } from '@/lib/api/reviews';
import { toast } from 'sonner';

/**
 * Custom hook for managing product review submission.
 * Handles review creation with loading states and error handling.
 * 
 * @returns Object containing submit handler and loading state
 * 
 * @example
 * const { submitReview, isSubmitting } = useReview();
 * 
 * await submitReview({
 *   productId: 123,
 *   orderId: 456,
 *   rating: 5,
 *   comment: 'Great product!'
 * });
 */
export function useReview() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitReview = async (payload: CreateReviewPayload): Promise<void> => {
        setIsSubmitting(true);
        try {
            await createReview(payload);
            toast.success('Review submitted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit review');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitReview,
        isSubmitting,
    };
}
