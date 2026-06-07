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
            toast.error('Không xác định được email người dùng');
            return;
        }

        const payloadWithEmail = {
            ...payload,
            email: session.user.email,
        };

        try {
            await createReviewMutation(payloadWithEmail).unwrap();
            toast.success('Gửi đánh giá thành công');
        } catch (error: unknown) {
            const message = getApiErrorMessage(error, 'Không thể gửi đánh giá');
            toast.error(message);
            throw error;
        }
    };

    return {
        submitReview,
        isSubmitting,
    };
}
