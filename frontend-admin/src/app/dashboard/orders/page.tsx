'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from '../../../features/orders/components/order-tables/columns';
import { OrderTable } from '../../../features/orders/components/order-tables/order-table';
import { useOrderTableFilters } from '../../../features/orders/components/order-tables/use-order-table-filters';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchOrders } from '@/lib/store/slices/orderSlice';
import { useEffect } from 'react';
import { OrderFilterRequest } from '@/types/order/order';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
    { title: 'Tổng quan', link: '/dashboard' },
    { title: 'Đơn hàng', link: '/dashboard/orders' },
];

export default function OrdersPage() {
    const dispatch = useAppDispatch();
    const { orders, loading, pagination } = useAppSelector((state) => state.orders);

    const {
        searchQuery,
        page,
        limit,
        status,
        setSearchQuery,
        setPage,
        setLimit,
        setStatus,
        resetFilters,
        isAnyFilterActive,
    } = useOrderTableFilters();

    useEffect(() => {
        const filter: OrderFilterRequest = {
            page: page - 1, // API is 0-indexed
            size: limit,
            groupNumber: searchQuery || undefined,
            overallStatus: status || undefined,
        };
        dispatch(fetchOrders(filter));
    }, [dispatch, page, limit, searchQuery, status]);

    const handlePageChange = (updater: any) => {
        const current0BasedPage = page - 1;
        const new0BasedPage = typeof updater === 'function' ? updater(current0BasedPage) : updater;
        setPage(new0BasedPage + 1);
    };

    return (
        <PageContainer scrollable>
            <div className="space-y-4 w-full">
                <Breadcrumbs />

                <div className="flex items-start justify-between">
                    <Heading
                        title={`Đơn hàng (${pagination.totalElements})`}
                        description="Quản lý đơn hàng và theo dõi trạng thái."
                    />
                </div>

                <Separator />

                {/* Filters would go here - for now basic search/status is handled via hooks */}

                <OrderTable
                    columns={columns}
                    data={orders}
                    pageCount={pagination.totalPages}
                    searchKey="groupNumber"
                    pageNo={page}
                    pageSize={limit}
                    totalUsers={pagination.totalElements}
                    pageSizeOptions={[10, 20, 50, 100]}
                    onPageChange={handlePageChange}
                    onPageSizeChange={setLimit}
                />
            </div>
        </PageContainer>
    );
}
