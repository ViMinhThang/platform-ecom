import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProductListingClient } from "./product-listing-client";
import { ProductProvider } from "@/providers/product-provider";

interface ProductListingPageProps {
  searchParams?: {
    page?: string;
    perPage?: string;
    name?: string;
    category?: string;
  };
}

export default async function ProductListingPage({ searchParams }: ProductListingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>You must be signed in to view products.</div>;
  }

  return (
      <ProductListingClient token={session.accessToken} searchParams={searchParams} />
  );
}
