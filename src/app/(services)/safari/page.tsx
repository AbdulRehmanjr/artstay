import { Suspense } from "react";
import { SafariFilter } from "~/components/safari/safari-filter";
import { SafariList } from "~/components/safari/safari-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <SafariFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <SafariList />
      </Suspense>
    </HydrateClient>
  );
}
