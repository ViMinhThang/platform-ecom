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
        <div className="relative bg-white border-2 border-black p-6 group transition-all hover:bg-zinc-50 h-full">
            <div className="pb-4 border-b-2 border-dashed border-zinc-200 mb-4 flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-black" />
                    <h4 className="font-black text-sm uppercase tracking-wider">
                        {address.buildingName}
                    </h4>
                </div>
                {address.isDefault && (
                    <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 border border-black uppercase">
                        DEFAULT_ADDR
                    </span>
                )}
            </div>

            <div className="text-xs font-mono text-zinc-600 space-y-1 mb-6">
                <p className="uppercase">{address.street}</p>
                <p className="uppercase">
                    {address.wardName}, {address.districtName}
                </p>
                <p className="uppercase">{address.provinceName}</p>
                <p className="uppercase">{address.country}</p>
            </div>

            <div className="flex justify-start space-x-0 border-t-2 border-black absolute bottom-0 left-0 right-0">
                <button
                    className="flex-1 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white border-r-2 border-black transition-colors flex items-center justify-center gap-2"
                    onClick={() => onEdit(address)}
                >
                    <Pencil className="h-3 w-3" /> CHỈNH SỬA
                </button>
                <button
                    className="flex-1 py-2 text-xs font-bold uppercase hover:bg-red-600 hover:text-white text-red-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => address.addressId && onDelete(address.addressId)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        <>
                            <Trash2 className="h-3 w-3" /> XÓA
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
