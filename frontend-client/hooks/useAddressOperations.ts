import { useState } from 'react';
import { Address } from '@/types/user';
import { createAddress, updateAddress, deleteAddress } from '@/lib/api/profile';
import { toast } from 'sonner';

/**
 * Custom hook for managing address CRUD operations.
 * Centralizes address business logic and provides consistent error handling.
 * 
 * @param onSuccess - Callback to execute after successful operations
 * @returns Object containing operation handlers and loading states
 * 
 * @example
 * const { handleCreate, handleUpdate, handleDelete, isDeleting } = useAddressOperations(onUpdate);
 */
export function useAddressOperations(onSuccess?: () => void) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleCreate = async (data: Address): Promise<void> => {
        try {
            await createAddress(data);
            toast.success('Address added successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create address');
            throw error;
        }
    };

    const handleUpdate = async (addressId: number, data: Address): Promise<void> => {
        try {
            await updateAddress(addressId, data);
            toast.success('Address updated successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update address');
            throw error;
        }
    };

    const handleDelete = async (addressId: number): Promise<void> => {
        setIsDeleting(addressId);
        try {
            await deleteAddress(addressId);
            toast.success('Address deleted successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete address');
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
