'use client';

import { useState } from 'react';
import { Address } from '@/types/user';
import { LIMITS, VALIDATION_MESSAGES } from '@/lib/constants';
import { useAddressOperations } from '@/hooks/useAddressOperations';
import { AddressForm } from './AddressForm';
import { AddressCard } from './AddressCard';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface AddressManagerProps {
    addresses: Address[];
    onUpdate: () => void;
}

/**
 * Component for managing user addresses (CRUD operations).
 * Refactored to use custom hooks for business logic and extracted components for presentation.
 */
export function AddressManager({ addresses, onUpdate }: AddressManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Use custom hook for address operations
    const { handleCreate, handleUpdate, handleDelete, isDeleting } = useAddressOperations(onUpdate);

    const handleAddClick = () => {
        if (addresses.length >= LIMITS.MAX_ADDRESSES) {
            toast.error(VALIDATION_MESSAGES.ADDRESS_LIMIT_REACHED);
            return;
        }
        setEditingAddress(undefined);
        setIsDialogOpen(true);
    };

    const handleEditClick = (address: Address) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (addressId: number) => {
        setDeleteId(addressId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await handleDelete(deleteId);
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleFormSubmit = async (data: Address) => {
        try {
            if (editingAddress?.addressId) {
                await handleUpdate(editingAddress.addressId, data);
            } else {
                await handleCreate(data);
            }
            setIsDialogOpen(false);
        } catch (error) {
            // Error handled by hook
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="items-center justify-between mb-8 hidden">
                <h3 className="text-xl font-bold uppercase tracking-tighter text-foreground">Địa chỉ của tôi <span className="text-primary italic">({addresses.length}/5)</span></h3>
                <Button onClick={handleAddClick} disabled={addresses.length >= 5} className="rounded-sm shadow-md transition-all hover:shadow-lg">
                    <Plus className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add New Button Card */}
                <button
                    onClick={handleAddClick}
                    disabled={addresses.length >= 5}
                    className="flex flex-col items-center justify-center h-full min-h-[220px] border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed rounded-sm bg-background shadow-sm hover:shadow-md"
                >
                    <div className="h-12 w-12 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary flex items-center justify-center transition-all mb-6 rounded-sm shadow-sm">
                        <Plus className="h-7 w-7" />
                    </div>
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-foreground">Thêm địa chỉ giao hàng</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase mt-2 opacity-50 tracking-widest">{addresses.length}/5 Slots used</span>
                </button>

                {addresses.map((address) => (
                    <AddressCard
                        key={address.addressId}
                        address={address}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        isDeleting={isDeleting === address.addressId}
                    />
                ))}

                {addresses.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/5 rounded-sm border border-dashed border-border mt-6">
                        <MapPin className="h-10 w-10 text-primary opacity-20 mb-4" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">CHƯA CÓ ĐỊA CHỈ NÀO ĐƯỢC LƯU.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Address Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                        </DialogTitle>
                    </DialogHeader>
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xóa địa chỉ</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting !== null}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting !== null}
                        >
                            {isDeleting !== null ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Đang xóa...
                                </>
                            ) : (
                                'Xóa'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
