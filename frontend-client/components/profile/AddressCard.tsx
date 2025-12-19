'use client';

import { Address } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pencil, Trash2 } from 'lucide-react';

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (addressId: number) => void;
    isDeleting: boolean;
}

/**
 * Component for displaying a single address card.
 * Follows Single Responsibility Principle - only displays address information.
 * 
 * @example
 * <AddressCard
 *   address={address}
 *   onEdit={(addr) => handleEdit(addr)}
 *   onDelete={(id) => handleDelete(id)}
 *   isDeleting={isDeleting === address.addressId}
 * />
 */
export function AddressCard({ address, onEdit, onDelete, isDeleting }: AddressCardProps) {
    return (
        <Card className="relative">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {address.buildingName}
                    </CardTitle>
                    {address.isDefault && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Mặc định
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
                        onClick={() => onEdit(address)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => address.addressId && onDelete(address.addressId)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
