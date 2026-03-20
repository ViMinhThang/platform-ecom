import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import VoucherListingPage from '@/components/admin/vouchers/voucher-listing';

export const metadata = {
    title: 'Bảng điều khiển: Voucher',
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    const searchParams = await props.searchParams;

    if (!session?.accessToken) {
        return <div>Bạn phải đăng nhập để xem voucher.</div>;
    }

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Quản lý Voucher"
                        description="Tạo và quản lý các mã giảm giá"
                    />
                    <Link
                        href="/admin/dashboard/vouchers/new"
                        className={cn(buttonVariants(), 'gap-2')}
                    >
                        <IconPlus className="h-4 w-4" />
                        Tạo voucher
                    </Link>
                </div>
                <Separator />
                <Suspense
                    fallback={
                        <DataTableSkeleton columnCount={8} rowCount={8} filterCount={2} />
                    }
                >
                    <VoucherListingPage searchParams={searchParams as Record<string, string>} />
                </Suspense>
            </div>
        </PageContainer>
    );
}
