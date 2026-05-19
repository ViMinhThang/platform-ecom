'use client';

import { SaleCampaign } from '@/types/sale-campaign';
import { SaleCampaignTable } from './sale-campaign-tables';
import { columns } from './sale-campaign-tables/columns';
import { useGetSaleCampaignsQuery } from '@/lib/store/admin';
import { useState } from 'react';

interface SaleCampaignListingClientProps {
    searchParams?: {
        page: number;
        perPage: number;
    };
}

export default function SaleCampaignListingClient({
    searchParams,
}: SaleCampaignListingClientProps) {
    const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
    const [perPage, setPerPage] = useState<number>(Number(searchParams?.perPage ?? 10));

    const { data, isLoading, refetch } = useGetSaleCampaignsQuery({ page, size: perPage });

    const campaigns = data?.content || [];
    const totalItems = data?.totalElements ?? 0;

    if (isLoading && campaigns.length === 0) {
        return <div>Đang tải chiến dịch...</div>;
    }

    return (
        <SaleCampaignTable
            data={campaigns}
            totalItems={totalItems}
            columns={columns}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            currentPage={page}
            pageSize={perPage}
            onRefresh={refetch}
        />
    );
}