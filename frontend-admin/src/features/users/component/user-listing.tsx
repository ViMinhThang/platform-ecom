import { searchParamsCache } from "@/lib/searchparams";
import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";

type UserListingPage = {};

export default async function UserListingPage({}: UserListingPage) {
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
  const totalUser = 100; // mock total
  const userList: never[] = []; // mock categories array

  return (
    <UserTable
      data={userList}
      totalItems={totalUser}
      columns={columns}
    />
  );
}   