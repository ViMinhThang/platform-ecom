'use client';

import { VoucherListingClient } from './voucher-listing-client';

interface VoucherListingPageProps {
    searchParams?: {
        page?: string;
        perPage?: string;
        status?: string;
    };
}

export default function VoucherListingPage({ searchParams }: VoucherListingPageProps) {
    // URL uses 1-based pagination (from use-data-table hook), convert to 0-based for backend API
    const urlPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const apiPage = Math.max(0, urlPage - 1); // Convert to 0-based, ensure non-negative
    
    return (
        <VoucherListingClient
            searchParams={{
                page: apiPage,
                perPage: searchParams?.perPage ? parseInt(searchParams.perPage) : 10,
                status: searchParams?.status,
            }}
        />
    );
}
