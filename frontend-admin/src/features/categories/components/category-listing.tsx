import { searchParamsCache } from "@/lib/searchparams";
import { CategoryTable } from "./category-tables";
import { columns } from "./category-tables/columns";

type CategoryListingPage = {};

export default async function CategoryListingPage({}: CategoryListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  // Replace with actual data fetching logic
  // const data = await fetchCategories(filters);
  // const totalCategories = data.total_categories;
  // const categoriesList: Category[] = data.categories;

  // For demonstration, using mock data
  const totalCategories = 100; // mock total
  const categoriesList: never[] = []; // mock categories array

  return (
    <CategoryTable
      data={categoriesList}
      totalItems={totalCategories}
      columns={columns}
    />
  );
}   