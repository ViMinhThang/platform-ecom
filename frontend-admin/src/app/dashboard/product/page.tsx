import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { ProductDialogWrapper } from "@/features/products/components/product-form/create-product";
import ProductListingPage from "@/features/products/components/product-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { ProductProvider } from "@/providers/product-provider";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard: Products",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = searchParamsCache.parse(searchParams);
  console.log("Search Params in Page Component:", params);
  return (
    <PageContainer scrollable={false}>
      <ProductProvider>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Products"
              description="Manage products (Server side table functionalities.)"
            />
            <ProductDialogWrapper />
          </div>

          <Separator />

          <Suspense
            fallback={
              <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
            }
          >
            <ProductListingPage searchParams={ params}/>
          </Suspense>
        </div>
      </ProductProvider>
    </PageContainer>
  );
}
