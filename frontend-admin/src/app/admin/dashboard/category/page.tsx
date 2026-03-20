import { authOptions } from "@/lib/auth-options";
import PageContainer from "@/components/layout/page-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import CategoryListingPage from "@/features/categories/components/category-listing";
import { CreateCategoryButton } from "@/features/categories/components/create-category";
import UserListingPage from "@/features/users/component/user-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
      <div className="flex flex-1 flex-col space-y-4">
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
