import { Suspense } from "react";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { ShopList } from "~/components/shop/shop-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <ShopList />
      </Suspense>
    </HydrateClient>
  );
}
