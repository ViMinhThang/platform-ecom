import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CategoryListingClient from "./category-listing-client";

interface ProductListingPageProps {
  searchParams?: {
    page: number;
    perPage: number;
    name: string | null;
    category: string | null;
  };
}

export default async function CategoryListingPage({
  searchParams,
}: ProductListingPageProps) {
  const session = await getServerSession(authOptions);
  console.log("Search Params in CategoryListingPage:", searchParams);
  if (!session?.accessToken) {
    return <div>You must be signed in to view categories.</div>;
  }

  return (
    <CategoryListingClient
      token={session.accessToken}
      searchParams={searchParams}
    />
  );
}
