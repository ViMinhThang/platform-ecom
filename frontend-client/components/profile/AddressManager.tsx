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
import { Plus } from 'lucide-react';
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
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Addresses ({addresses.length}/5)</h3>
                <Button onClick={handleAddClick} disabled={addresses.length >= 5}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No addresses found</h3>
                        <p className="text-sm mt-1 mb-4">Add a shipping address to get started.</p>
                        <Button onClick={handleAddClick} variant="outline">
                            Add New Address
                        </Button>
                    </div>
                )}
            </div>

            {/* Add/Edit Address Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
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
                        <DialogTitle>Delete Address</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting !== null}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting !== null}
                        >
                            {isDeleting !== null ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
