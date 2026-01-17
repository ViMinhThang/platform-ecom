'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { voucherService } from '@/lib/services/voucher-service';
import { Voucher, VOUCHER_STATUS_LABELS, VOUCHER_CATEGORY_LABELS } from '@/types/voucher';
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
        category?: string;
    };
}

export function VoucherListingClient({ searchParams }: VoucherListingClientProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const urlSearchParams = useSearchParams();

    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(searchParams?.page ?? 0);
    const [perPage, setPerPage] = useState(searchParams?.perPage ?? 10);

    const currentStatus = urlSearchParams.get('status') || '';
    const currentCategory = urlSearchParams.get('category') || '';

    const fetchVouchers = async () => {
        if (!session?.accessToken) return;

        try {
            setLoading(true);
            const response = await voucherService.getAll({
                page,
                size: perPage,
                status: currentStatus || undefined,
                category: currentCategory || undefined,
            });
            setVouchers(response.content);
            setTotalItems(response.totalElements);
        } catch (error) {
            console.error('Failed to fetch vouchers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, [session, page, perPage, currentStatus, currentCategory]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(urlSearchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '0');
        router.push(`?${params.toString()}`);
    };

    const resetFilters = () => {
        router.push('/dashboard/vouchers');
    };

    const hasFilters = currentStatus || currentCategory;

    if (loading && vouchers.length === 0) {
        return <div>Đang tải voucher...</div>;
    }

    return (
        <div className="flex flex-1 flex-col space-y-4">
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

                <Select value={currentCategory || 'all'} onValueChange={(v) => updateFilter('category', v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {Object.entries(VOUCHER_CATEGORY_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
                        Đặt lại
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <VoucherTable
                key={vouchers.length} // Force re-render when data changes
                data={vouchers}
                totalItems={totalItems}
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
