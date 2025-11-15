import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProductListingClient } from "./product-listing-client";

interface ProductListingPageProps {
  searchParams?: {
    page: number;
    perPage: number;
    name: string | null;
    category: string | null;
  };
}

export default async function ProductListingPage({ searchParams }: ProductListingPageProps) {
  const session = await getServerSession(authOptions);
  console.log("Search Params in ProductListingPage:", searchParams);
  if (!session?.accessToken) {
    return <div>You must be signed in to view products.</div>;
  }

  return (
      <ProductListingClient token={session.accessToken} searchParams={searchParams} />
  );
}
