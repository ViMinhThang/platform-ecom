import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCreateReviewMutation } from '@/lib/store/api/clientApi';
import { CreateReviewPayload } from '@/lib/services/review-service';
import { getApiErrorMessage } from '@/lib/api-error-message';

export function useReview() {
    const { data: session } = useSession();
    const [createReviewMutation, { isLoading: isSubmitting }] = useCreateReviewMutation();

    const submitReview = async (payload: CreateReviewPayload): Promise<void> => {
        if (!session?.user?.email) {
            toast.error('Could not determine user email');
            return;
        }

        const payloadWithEmail = {
            ...payload,
            email: session.user.email,
        };

        try {
            await createReviewMutation(payloadWithEmail).unwrap();
            toast.success('Review submitted successfully');
        } catch (error: unknown) {
            const message = getApiErrorMessage(error, 'Failed to submit review');
            toast.error(message);
            throw error;
        }
    };

    return {
        submitReview,
        isSubmitting,
    };
}
