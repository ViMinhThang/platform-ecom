'use client';

import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from '@/components/admin/orders/order-tables/columns';
import { OrderTable } from '@/components/admin/orders/order-tables/order-table';
import { useOrderTableFilters } from '@/components/admin/orders/order-tables/use-order-table-filters';
import { useGetOrdersQuery, OrderFilterRequest } from '@/lib/store/admin';
import PageContainer from '@/components/admin/layout/page-container';

export default function OrdersPage() {
    const {
        searchQuery,
        page,
        limit,
        status,
        setPage,
        setLimit,
    } = useOrderTableFilters();

    const filter: OrderFilterRequest = {
        page: page - 1,
        size: limit,
        groupNumber: searchQuery || undefined,
        overallStatus: status || undefined,
    };

    const { data, isLoading } = useGetOrdersQuery(filter);

    const orders = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 0;

    const handlePageChange = (updater: (prev: number) => number) => {
        setPage(updater);
    };

    return (
        <PageContainer scrollable>
            <div className="space-y-4 w-full">
                <Breadcrumbs />

                <div className="flex items-start justify-between">
                    <Heading
                        title={`Đơn hàng (${totalElements})`}
                        description="Quản lý đơn hàng và theo dõi trạng thái."
                    />
                </div>

                <Separator />

                <OrderTable
                    columns={columns}
                    data={orders}
                    pageCount={totalPages}
                    searchKey="groupNumber"
                    pageNo={page}
                    pageSize={limit}
                    totalUsers={totalElements}
                    pageSizeOptions={[10, 20, 50, 100]}
                    onPageChange={handlePageChange}
                    onPageSizeChange={setLimit}
                />
            </div>
        </PageContainer>
    );
}
