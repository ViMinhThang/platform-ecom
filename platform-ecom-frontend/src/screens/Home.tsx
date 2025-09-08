import { useGetProductsByCategoryQuery } from "@/slice/productApiSlice";
import shoesBanner from "@/assets/shoes-banner.jpg";
import accessoriesBanner from "@/assets/accessories-banner.avif";
import clothingBanner from "@/assets/clothing-banner.avif";
import CategorySection from "@/components/CategorySection";

const Home = () => {
  // Shoes
  const {
    data: shoesProducts,
    isLoading: isLoadingShoes,
    error: errorShoes,
  } = useGetProductsByCategoryQuery({
    category: "shoes",
    pageNumber: 0,
    pageSize: 4,
    sortBy: "price",
    sortOrder: "desc",
  });

  // Clothing
  const {
    data: clothingProducts,
    isLoading: isLoadingClothing,
    error: errorClothing,
  } = useGetProductsByCategoryQuery({
    category: "clothing",
    pageNumber: 0,
    pageSize: 4,
    sortBy: "price",
    sortOrder: "desc",
  });

  // Accessories
  const {
    data: accessoriesProducts,
    isLoading: isLoadingAccessories,
    error: errorAccessories,
  } = useGetProductsByCategoryQuery({
    category: "accessories",
    pageNumber: 0,
    pageSize: 4,
    sortBy: "price",
    sortOrder: "desc",
  });

  return (
    <div>
      <CategorySection
        title="Shoes"
        banner={shoesBanner}
        products={shoesProducts}
        isLoading={isLoadingShoes}
        error={errorShoes}
      />

      <CategorySection
        title="Clothing"
        banner={clothingBanner}
        products={clothingProducts}
        isLoading={isLoadingClothing}
        error={errorClothing}
      />

      <CategorySection
        title="Accessories"
        banner={accessoriesBanner}
        products={accessoriesProducts}
        isLoading={isLoadingAccessories}
        error={errorAccessories}
      />
    </div>
  );
};

export default Home;
