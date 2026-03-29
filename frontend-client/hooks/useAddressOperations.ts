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
            toast.error('Bạn phải đăng nhập để thêm địa chỉ');
            return;
        }

        try {
            await addAddressMutation(data).unwrap();
            toast.success('Thêm địa chỉ thành công');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Thêm địa chỉ thất bại');
            throw error;
        }
    };

    const handleUpdate = async (addressId: number, data: Address): Promise<void> => {
        if (!session?.accessToken) {
            toast.error('Bạn phải đăng nhập để cập nhật địa chỉ');
            return;
        }

        try {
            await updateAddressMutation({ addressId, address: data }).unwrap();
            toast.success('Cập nhật địa chỉ thành công');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Cập nhật địa chỉ thất bại');
            throw error;
        }
    };

    const handleDelete = async (addressId: number): Promise<void> => {
        if (!session?.accessToken) {
            toast.error('Bạn phải đăng nhập để xóa địa chỉ');
            return;
        }

        setIsDeleting(addressId);
        try {
            await deleteAddressMutation(addressId).unwrap();
            toast.success('Xóa địa chỉ thành công');
            refetch();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Xóa địa chỉ thất bại');
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
