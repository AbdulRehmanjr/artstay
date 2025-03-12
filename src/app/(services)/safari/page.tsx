import { Suspense } from "react";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { SafariList } from "~/components/safari/safari-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <SafariList />
      </Suspense>
    </HydrateClient>
  );
}
