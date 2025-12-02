import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Address } from '@/types/user';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/store/hooks';
import { addAddress, editAddress, removeAddress } from '@/lib/store/slices/addressSlice';

/**
 * Custom hook for managing address CRUD operations using Redux.
 * Automatically retrieves token from NextAuth session.
 * 
 * @param onSuccess - Callback to execute after successful operations
 * @returns Object containing operation handlers and loading states
 */
export function useAddressOperations(onSuccess?: () => void) {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleCreate = async (data: Address): Promise<void> => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to add addresses');
            return;
        }

        try {
            await dispatch(addAddress({ address: data, token })).unwrap();
            toast.success('Address added successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error || 'Failed to create address');
            throw error;
        }
    };

    const handleUpdate = async (addressId: number, data: Address): Promise<void> => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to update addresses');
            return;
        }

        try {
            await dispatch(editAddress({ addressId, address: data, token })).unwrap();
            toast.success('Address updated successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error || 'Failed to update address');
            throw error;
        }
    };

    const handleDelete = async (addressId: number): Promise<void> => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to delete addresses');
            return;
        }

        setIsDeleting(addressId);
        try {
            await dispatch(removeAddress({ addressId, token })).unwrap();
            toast.success('Address deleted successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error || 'Failed to delete address');
            throw error;
        } finally {
            setIsDeleting(null);
        }
    };

    return {
        handleCreate,
        handleUpdate,
        handleDelete,
        isDeleting,
    };
}
