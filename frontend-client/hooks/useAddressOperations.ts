import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Address } from '@/types/user';
import { toast } from 'sonner';
import { useGetAddressesQuery, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from '@/lib/store/api/clientApi';

export function useAddressOperations(onSuccess?: () => void) {
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const { refetch } = useGetAddressesQuery();
    const [addAddressMutation] = useAddAddressMutation();
    const [updateAddressMutation] = useUpdateAddressMutation();
    const [deleteAddressMutation] = useDeleteAddressMutation();

    const handleCreate = async (data: Address): Promise<void> => {
        if (!session?.accessToken) {
            toast.error('You must be logged in to add addresses');
            return;
        }

        try {
            await addAddressMutation(data).unwrap();
            toast.success('Address added successfully');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Failed to create address');
            throw error;
        }
    };

    const handleUpdate = async (addressId: number, data: Address): Promise<void> => {
        if (!session?.accessToken) {
            toast.error('You must be logged in to update addresses');
            return;
        }

        try {
            await updateAddressMutation({ addressId, address: data }).unwrap();
            toast.success('Address updated successfully');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Failed to update address');
            throw error;
        }
    };

    const handleDelete = async (addressId: number): Promise<void> => {
        if (!session?.accessToken) {
            toast.error('You must be logged in to delete addresses');
            return;
        }

        setIsDeleting(addressId);
        try {
            await deleteAddressMutation(addressId).unwrap();
            toast.success('Address deleted successfully');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Failed to delete address');
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
