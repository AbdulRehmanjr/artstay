import { Suspense } from "react";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { FairList } from "~/components/fair/fair-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <FairList />
      </Suspense>
    </HydrateClient>
  );
}
