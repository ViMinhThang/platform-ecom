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
  console.log("Search Params in CategoryListingPage:", searchParams);

  return (
    <CategoryListingClient
      searchParams={searchParams}
    />
  );
}
