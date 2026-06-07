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
        <div className="relative bg-background border border-border p-8 py-10 group transition-all hover:shadow-lg h-full rounded-sm shadow-md">
            <div className="pb-6 border-b border-border mb-6 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-primary" />
                    <h4 className="font-semibold text-[11px] uppercase tracking-[0.2em] text-foreground">
                        {address.buildingName}
                    </h4>
                </div>
                {address.isDefault && (
                    <span className="text-[8px] font-bold bg-primary/10 text-primary px-3 py-1 border border-primary/20 uppercase tracking-widest rounded-sm">
                        ĐỊA CHỈ MẶC ĐỊNH
                    </span>
                )}
            </div>

            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest space-y-2 mb-12 opacity-60 leading-relaxed">
                <p>{address.street}</p>
                <p>
                    {address.wardName}, {address.districtName}
                </p>
                <p>{address.provinceName}</p>
                <p>{address.country}</p>
            </div>

            <div className="flex justify-start border-t border-border absolute bottom-0 left-0 right-0">
                <button
                    className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 text-foreground border-r border-border transition-all flex items-center justify-center gap-3"
                    onClick={() => onEdit(address)}
                >
                    <Pencil className="size-3.5 text-primary opacity-50" /> CHỈNH SỬA
                </button>
                <button
                    className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 text-red-500 transition-all flex items-center justify-center gap-3"
                    onClick={() => address.addressId && onDelete(address.addressId)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        <>
                            <Trash2 className="size-3.5 opacity-50" /> XÓA
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
