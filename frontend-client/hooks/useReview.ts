import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { submitReview } from '@/lib/store/slices/reviewSlice';
import { CreateReviewPayload } from '@/lib/services/review-service';

/**
 * Custom hook for managing product review submission with Redux.
 * Handles review creation with loading states and error handling.
 * 
 * @returns Object containing submit handler and loading state
 */
export function useReview() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { submitting: isSubmitting } = useAppSelector(state => state.reviews);

    const handleSubmitReview = async (payload: CreateReviewPayload): Promise<void> => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to submit a review');
            return;
        }

        try {
            await dispatch(submitReview({ payload, token })).unwrap();
            toast.success('Review submitted successfully');
        } catch (error: any) {
            toast.error(error || 'Failed to submit review');
            throw error;
        }
    };

    return {
        submitReview: handleSubmitReview,
        isSubmitting,
    };
}
