import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { submitReview, submitUnverifiedReview } from '@/lib/store/slices/reviewSlice';
import { CreateReviewPayload, CreateUnverifiedReviewPayload } from '@/lib/services/review-service';

/**
 * Custom hook for managing product review submission with Redux.
 * Handles both verified and unverified review creation.
 * 
 * @returns Object containing submit handlers and loading state
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

        const payloadWithEmail = {
            ...payload,
            email: session?.user?.email || undefined,
        };

        try {
            await dispatch(submitReview({ payload: payloadWithEmail, token })).unwrap();
            toast.success('Review submitted successfully');
        } catch (error: any) {
            toast.error(error || 'Failed to submit review');
            throw error;
        }
    };

    const handleSubmitUnverifiedReview = async (payload: CreateUnverifiedReviewPayload): Promise<void> => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to submit a review');
            return;
        }

        const payloadWithEmail = {
            ...payload,
            email: session?.user?.email || undefined,
        };

        try {
            await dispatch(submitUnverifiedReview({ payload: payloadWithEmail, token })).unwrap();
            toast.success('Review submitted successfully');
        } catch (error: any) {
            toast.error(error || 'Failed to submit review');
            throw error;
        }
    };

    return {
        submitReview: handleSubmitReview,
        submitUnverifiedReview: handleSubmitUnverifiedReview,
        isSubmitting,
    };
}
