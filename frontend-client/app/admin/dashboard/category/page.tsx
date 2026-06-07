import { authOptions } from "@/lib/auth-options";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import CategoryListingPage from "@/components/admin/categories/category-listing";
import { CreateCategoryButton } from "@/components/admin/categories/create-category";
import { searchParamsCache } from "@/lib/searchparams";
import { getServerSession } from "next-auth";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
  title: "Bảng điều khiển: Danh mục",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>Bạn phải đăng nhập để xem danh mục.</div>;
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Danh mục"
            description="Quản lý danh mục sản phẩm"
          />
          <CreateCategoryButton token={session?.accessToken} />
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <CategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
