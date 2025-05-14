import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { TravelPlannerFilter } from "~/components/travel/travel-filter";
import { TravelPlannerList } from "~/components/travel/travel-list";

export const dynamic = 'force-dynamic'

export default function TravelPlannerPage() {
  return (
    <HydrateClient>
      <TravelPlannerFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <TravelPlannerList />
      </Suspense>
    </HydrateClient>
  );
}