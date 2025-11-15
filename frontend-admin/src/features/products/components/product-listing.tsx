import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProductListingClient } from "./product-listing-client";
import { ProductProvider } from "@/providers/product-provider";

interface ProductListingPageProps {

}

export default async function ProductListingPage() {
  const session = await getServerSession(authOptions);
  console.log("Search Params in ProductListingPage:", );
  if (!session?.accessToken) {
    return <div>You must be signed in to view products.</div>;
  }

  return (
      <ProductListingClient token={session.accessToken} />
  );
}
