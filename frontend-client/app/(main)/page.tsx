import { HomeBanner } from "@/components/home/HomeBanner";
import { ProductFeed } from "@/components/home/ProductFeed";
import { CuratedCollections } from "@/components/home/CuratedCollections";
import { SingleActiveCampaign } from "@/components/home/SingleActiveCampaign";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* SECTION 1: EDITORIAL HERO */}
      <HomeBanner />

      {/* SECTION 2: ACTIVE CAMPAIGN (Dossier Registry) */}
      <SingleActiveCampaign />

      {/* SECTION 3: CURATED COLLECTIONS (FRAGMENTED GRID) */}
      <CuratedCollections />

      {/* SECTION 4: PRODUCT ACQUISITIONS (MINIMAL GRID) */}
      <ProductFeed />
    </div>
  );
}
