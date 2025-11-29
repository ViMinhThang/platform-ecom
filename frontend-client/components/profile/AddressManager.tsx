'use client';

import { useState } from 'react';
import { Address } from '@/types/user';
import { createAddress, updateAddress, deleteAddress } from '@/lib/api/profile';
import { AddressForm } from './AddressForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface AddressManagerProps {
    addresses: Address[];
    onUpdate: () => void;
}

export function AddressManager({ addresses, onUpdate }: AddressManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleAddClick = () => {
        if (addresses.length >= 5) {
            toast.error('You can only have a maximum of 5 addresses');
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

        setIsDeleting(deleteId);
        try {
            await deleteAddress(deleteId);
            toast.success('Address deleted successfully');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete address');
        } finally {
            setIsDeleting(null);
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const handleFormSubmit = async (data: Address) => {
        try {
            if (editingAddress && editingAddress.addressId) {
                await updateAddress(editingAddress.addressId, data);
                toast.success('Address updated successfully');
            } else {
                await createAddress(data);
                toast.success('Address added successfully');
            }
            setIsDialogOpen(false);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save address');
            throw error; // Re-throw to let form handle loading state if needed
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <Card key={address.addressId} className="relative">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-medium flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {address.buildingName}
                                </CardTitle>
                                {address.isDefault && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                        Default
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>{address.street}</p>
                                <p>
                                    {address.wardName}, {address.districtName}
                                </p>
                                <p>{address.provinceName}</p>
                                <p>{address.country}</p>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditClick(address)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => address.addressId && handleDeleteClick(address.addressId)}
                                    disabled={isDeleting === address.addressId}
                                >
                                    {isDeleting === address.addressId ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {addresses.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>No addresses found. Add one to get started.</p>
                    </div>
                )}
            </div>

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
