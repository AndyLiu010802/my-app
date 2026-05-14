import { Suspense } from "react";
import BuyPageClient from "../components/BuyPageClient";
import { getBuyHeroImageUrl } from "../../lib/content";

export const metadata = { title: "Buy | South Property" };

export default async function BuyPage() {
  const heroImageUrl = await getBuyHeroImageUrl();
  return (
    <Suspense>
      <BuyPageClient heroImageUrl={heroImageUrl} />
    </Suspense>
  );
}


// buy page plus the search bar should nmove the page into property grid section rather tyhan leave user with confusion 