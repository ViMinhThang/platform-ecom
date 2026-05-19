'use client';

import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import SaleCampaignListingClient from '@/components/admin/sale-campaigns/sale-campaign-listing-client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SaleCampaignsContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 0;
    const perPage = Number(searchParams.get('perPage')) || 10;

    return <SaleCampaignListingClient searchParams={{ page, perPage }} />;
}

export default function Page() {
    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Chiến dịch khuyến mãi"
                        description="Quản lý các chiến dịch giảm giá theo danh mục"
                    />
                    <Link
                        href="/admin/dashboard/sale-campaigns/new"
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
                    <SaleCampaignsContent />
                </Suspense>
            </div>
        </PageContainer>
    );
}