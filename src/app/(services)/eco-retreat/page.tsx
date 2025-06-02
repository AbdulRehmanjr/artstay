import { Suspense } from "react";
import { HotelList } from "~/components/eco-retreat/hotel-list";
import { EcoRetreatFilter } from "~/components/eco-retreat/retreat-filter";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function EcoretreatPage() {
  return (
    <HydrateClient>
      <EcoRetreatFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <HotelList />
      </Suspense>
    </HydrateClient>
  );
}
