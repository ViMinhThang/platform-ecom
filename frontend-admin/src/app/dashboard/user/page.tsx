import { authOptions } from "@/lib/auth-options";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { CreateUserButton } from "@/features/users/component/create-user";
import UserListingPage from "@/features/users/component/user-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { getServerSession } from "next-auth";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard: Users",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>You must be signed in to view categories.</div>;
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Users" description="Manage users" />
          <CreateUserButton />
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <UserListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
