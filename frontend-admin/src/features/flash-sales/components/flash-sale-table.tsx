'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FlashSale } from '@/types/flash-sale';
import { FlashSaleStatusBadge } from './flash-sale-status-badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash, Play, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import Link from 'next/link';

interface FlashSaleTableColumnsProps {
    onDelete: (id: number) => void;
    onActivate: (id: number) => void;
    onCancel: (id: number) => void;
}

export function getFlashSaleColumns({
    onDelete,
    onActivate,
    onCancel,
}: FlashSaleTableColumnsProps): ColumnDef<FlashSale>[] {
    return [
        {
            accessorKey: 'name',
            header: 'NAME',
            cell: ({ row }) => (
                <div className="font-bold text-sm uppercase tracking-wide">
                    {row.getValue('name')}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => <FlashSaleStatusBadge status={row.getValue('status')} />,
        },
        {
            accessorKey: 'startTime',
            header: 'START',
            cell: ({ row }) => (
                <span className="text-xs font-mono">
                    {format(new Date(row.getValue('startTime')), 'dd/MM/yyyy HH:mm')}
                </span>
            ),
        },
        {
            accessorKey: 'endTime',
            header: 'END',
            cell: ({ row }) => (
                <span className="text-xs font-mono">
                    {format(new Date(row.getValue('endTime')), 'dd/MM/yyyy HH:mm')}
                </span>
            ),
        },
        {
            accessorKey: 'totalItems',
            header: 'ITEMS',
            cell: ({ row }) => (
                <span className="text-sm font-bold">{row.getValue('totalItems')}</span>
            ),
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            cell: ({ row }) => {
                const flashSale = row.original;
                const canActivate = flashSale.status === 'DRAFT';
                const canCancel = flashSale.status === 'ACTIVE' || flashSale.status === 'SCHEDULED';
                const canEdit = flashSale.status !== 'ACTIVE';
                const canDelete = flashSale.status !== 'ACTIVE';

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/flash-sales/${flashSale.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/flash-sales/${flashSale.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canActivate && (
                                <DropdownMenuItem onClick={() => onActivate(flashSale.id)}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                </DropdownMenuItem>
                            )}
                            {canCancel && (
                                <DropdownMenuItem onClick={() => onCancel(flashSale.id)}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete(flashSale.id)}
                                        className="text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
