import { HomeBanner } from "@/components/home/HomeBanner";
import { ProductFeed } from "@/components/home/ProductFeed";
import { CuratedCollections } from "@/components/home/CuratedCollections";
import { CampaignBanners } from "@/components/home/CampaignBanners";
import { SingleActiveCampaign } from "@/components/home/SingleActiveCampaign";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HomeBanner />

      <CuratedCollections />

      <SingleActiveCampaign />

      <CampaignBanners />

      <ProductFeed />
    </div>
  );
}
