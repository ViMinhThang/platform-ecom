import { useGetProductsByCategoryQuery } from "@/slice/productApiSlice";
import electronicsBanner from "@/assets/electronics-banner.jpg";
import sportsBanner from "@/assets/sport-banner.avif";
import clothingBanner from "@/assets/clothing-banner.jpg";
import CategorySection from "@/components/CategorySection";

const Home = () => {
  // Electronics
  const {
    data: electronicsProducts,
    isLoading: isLoadingElectronics,
    error: errorElectronics,
  } = useGetProductsByCategoryQuery({
    category: "electronics",
    pageNumber: 0,
    pageSize: 4,
    sortBy: "price",
    sortOrder: "desc",
  });

  // Sports
  const {
    data: sportsProducts,
    isLoading: isLoadingSports,
    error: errorSports,
  } = useGetProductsByCategoryQuery({
    category: "sports",
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

  return (
    <div>
      <CategorySection
        title="Electronics"
        banner={electronicsBanner}
        products={electronicsProducts?.content ?? []}
        isLoading={isLoadingElectronics}
        error={errorElectronics}
      />

      <CategorySection
        title="Sports"
        banner={sportsBanner}
        products={sportsProducts?.content ?? []}
        isLoading={isLoadingSports}
        error={errorSports}
      />

      <CategorySection
        title="Clothing"
        banner={clothingBanner}
        products={clothingProducts?.content ?? []}
        isLoading={isLoadingClothing}
        error={errorClothing}
      />
    </div>
  );
};

export default Home;
