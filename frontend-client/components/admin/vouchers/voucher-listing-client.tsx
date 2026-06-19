'use client';

import { Suspense, useEffect, useState, useReducer } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { voucherService } from '@/lib/services/voucher-service';
import { Voucher, VOUCHER_STATUS_LABELS } from '@/types/voucher';
import { VoucherTable } from './voucher-tables';
import { columns } from './voucher-tables/columns';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface VoucherListingClientProps {
    searchParams?: {
        page?: number;
        perPage?: number;
        status?: string;
    };
}

function VoucherListingClientContent({ searchParams }: VoucherListingClientProps) {
    const { data: session } = useSession();
    const { push } = useRouter();
    const urlSearchParams = useSearchParams();
    const get = urlSearchParams.get.bind(urlSearchParams);
    const toString = urlSearchParams.toString.bind(urlSearchParams);

    const [fetchState, dispatchFetch] = useReducer(
        (prev: any, next: any) => ({ ...prev, ...next }),
        { vouchers: [] as Voucher[], totalItems: 0, loading: true }
    );
    const [page, setPage] = useState(searchParams?.page ?? 0);
    const [perPage, setPerPage] = useState(searchParams?.perPage ?? 10);

    const currentStatus = get('status') || '';

    const fetchVouchers = async () => {
        if (!session?.accessToken) return;

        try {
            dispatchFetch({ loading: true });
            const response = await voucherService.getAll({
                page,
                size: perPage,
                status: currentStatus || undefined,
            });
            dispatchFetch({ vouchers: response.content, totalItems: response.totalElements });
        } catch (error) {
            console.error('Failed to fetch vouchers:', error);
        } finally {
            dispatchFetch({ loading: false });
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, [session, page, perPage, currentStatus]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '0');
        push(`?${params.toString()}`);
    };

    const resetFilters = () => {
        push('/admin/dashboard/vouchers');
    };

    const hasFilters = !!currentStatus;

    if (fetchState.loading && fetchState.vouchers.length === 0) {
        return <div>Đang tải mã giảm giá…</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-y-4">
            <div className="flex flex-wrap items-center gap-4">
                <Select value={currentStatus || 'all'} onValueChange={(v) => updateFilter('status', v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        {Object.entries(VOUCHER_STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
                        Đặt lại
                        <X className="ml-2 size-4" />
                    </Button>
                )}
            </div>

            <VoucherTable
                key={fetchState.vouchers.length}
                data={fetchState.vouchers}
                totalItems={fetchState.totalItems}
                columns={columns}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
                currentPage={page}
                pageSize={perPage}
                onRefresh={fetchVouchers}
            />
        </div>
    );
}

export function VoucherListingClient(props: VoucherListingClientProps) {
    return (
        <Suspense fallback={<div className="h-40 animate-pulse bg-secondary/10 rounded-sm" />}>
            <VoucherListingClientContent {...props} />
        </Suspense>
    );
}
