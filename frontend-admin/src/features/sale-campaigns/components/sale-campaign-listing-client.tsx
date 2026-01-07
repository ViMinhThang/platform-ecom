'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { saleCampaignService } from '@/lib/services/sale-campaign-service';
import { SaleCampaign } from '@/types/sale-campaign';
import { SaleCampaignTable } from './sale-campaign-tables';
import { columns } from './sale-campaign-tables/columns';

interface SaleCampaignListingClientProps {
    searchParams?: {
        page: number;
        perPage: number;
    };
}

export default function SaleCampaignListingClient({
    searchParams,
}: SaleCampaignListingClientProps) {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState<SaleCampaign[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
    const [perPage, setPerPage] = useState<number>(
        Number(searchParams?.perPage ?? 10)
    );

    const fetchCampaigns = async () => {
        if (!session?.accessToken) return;

        try {
            setLoading(true);
            const response = await saleCampaignService.getAll({ page, size: perPage });
            setCampaigns(response.content);
            setTotalItems(response.totalElements);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [session, page, perPage]);

    if (loading && campaigns.length === 0) {
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
            onRefresh={fetchCampaigns}
        />
    );
}
