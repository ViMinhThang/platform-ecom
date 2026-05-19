import PageContainer from "@/components/admin/layout/page-container";
import { ProductDialogWrapper } from "@/components/admin/products/product-form/create-product";
import { ProductDialog } from "@/components/admin/products/product-form/product-form";
import ProductListingPage from "@/components/admin/products/product-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata = {
    title: "Bảng điều khiển: Sản phẩm",
};

type pageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Sản phẩm"
                        description="Quản lý sản phẩm của cửa hàng"
                    />
                    <ProductDialogWrapper />
                </div>

                <Separator />

                <Suspense
                    fallback={
                        <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
                    }
                >
                    <ProductListingPage />
                </Suspense>
            </div>
        </PageContainer>
    );
}
