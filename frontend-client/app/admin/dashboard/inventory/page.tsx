import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import InventoryListingPage from "@/components/admin/inventory/inventory-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
    title: "Bảng điều khiển: Kho hàng",
};

type pageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
    const searchParams = await props.searchParams;
    searchParamsCache.parse(searchParams);

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col gap-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Kho hàng"
                        description="Quản lý mức tồn kho, theo dõi hàng tồn, và xử lý cảnh báo hết hàng."
                    />
                </div>

                <Separator />

                <Suspense
                    fallback={
                        <DataTableSkeleton columnCount={8} rowCount={10} filterCount={2} />
                    }
                >
                    <InventoryListingPage />
                </Suspense>
            </div>
        </PageContainer>
    );
}

