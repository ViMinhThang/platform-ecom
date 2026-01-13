'use client';

import { VoucherListingClient } from './voucher-listing-client';

interface VoucherListingPageProps {
    searchParams?: {
        page?: string;
        size?: string;
        status?: string;
        category?: string;
    };
}

export default function VoucherListingPage({ searchParams }: VoucherListingPageProps) {
    return (
        <VoucherListingClient
            searchParams={{
                page: searchParams?.page ? parseInt(searchParams.page) : 0,
                perPage: searchParams?.size ? parseInt(searchParams.size) : 10,
                status: searchParams?.status,
                category: searchParams?.category,
            }}
        />
    );
}
