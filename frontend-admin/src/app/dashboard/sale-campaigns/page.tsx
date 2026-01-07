import { authOptions } from '@/lib/auth-options';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import SaleCampaignListingPage from '@/features/sale-campaigns/components/sale-campaign-listing';

export const metadata = {
    title: 'Bảng điều khiển: Chiến dịch khuyến mãi',
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return <div>Bạn phải đăng nhập để xem chiến dịch khuyến mãi.</div>;
    }

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Chiến dịch khuyến mãi"
                        description="Quản lý các chiến dịch giảm giá theo danh mục"
                    />
                    <Link
                        href="/dashboard/sale-campaigns/new"
                        className={cn(buttonVariants(), 'gap-2')}
                    >
                        <IconPlus className="h-4 w-4" />
                        Tạo chiến dịch
                    </Link>
                </div>
                <Separator />
                <Suspense
                    fallback={
                        <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
                    }
                >
                    <SaleCampaignListingPage />
                </Suspense>
            </div>
        </PageContainer>
    );
}
