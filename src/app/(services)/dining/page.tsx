import { Suspense } from "react";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { RestaurantList } from "~/components/dining/dining-list";
import { RestaurantListSkeleton } from "~/components/skeletons/dining";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<RestaurantListSkeleton/>}>
        <RestaurantList />
      </Suspense>
    </HydrateClient>
  );
}
