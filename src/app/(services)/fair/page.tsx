import { Suspense } from "react";
import { FairFilter } from "~/components/fair/fair-filter";
import { FairList } from "~/components/fair/fair-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <FairFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <FairList />
      </Suspense>
    </HydrateClient>
  );
}
