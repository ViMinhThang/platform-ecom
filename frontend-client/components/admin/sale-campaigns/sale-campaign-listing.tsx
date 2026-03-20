import SaleCampaignListingClient from './sale-campaign-listing-client';

interface SaleCampaignListingPageProps {
    searchParams?: {
        page: number;
        perPage: number;
    };
}

export default async function SaleCampaignListingPage({
    searchParams,
}: SaleCampaignListingPageProps) {
    return <SaleCampaignListingClient searchParams={searchParams} />;
}
