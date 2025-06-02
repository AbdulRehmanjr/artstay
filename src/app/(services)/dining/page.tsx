import { Suspense } from "react";
import { DiningFilter } from "~/components/dining/dining-filter";
import { RestaurantList } from "~/components/dining/dining-list";
import { RestaurantListSkeleton } from "~/components/skeletons/dining";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'

export default function DiningPage() {
  return (
    <HydrateClient>
      <DiningFilter />
      <Suspense fallback={<RestaurantListSkeleton/>}>
        <RestaurantList />
      </Suspense>
    </HydrateClient>
  );
}