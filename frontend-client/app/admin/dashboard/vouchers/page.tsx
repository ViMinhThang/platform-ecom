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
    title: 'Bảng điều khiển: Mã giảm giá',
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    const [session, searchParams] = await Promise.all([
        getServerSession(authOptions),
        props.searchParams,
    ]);

    if (!session?.accessToken) {
        return <div>Bạn phải đăng nhập để xem mã giảm giá.</div>;
    }

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col gap-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Quản lý mã giảm giá"
                        description="Tạo và quản lý các mã giảm giá"
                    />
                    <Link
                        href="/admin/dashboard/vouchers/new"
                        className={cn(buttonVariants(), 'gap-2')}
                    >
                        <IconPlus className="size-4" />
                        Tạo mã giảm giá
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
