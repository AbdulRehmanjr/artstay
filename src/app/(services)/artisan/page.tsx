import { Suspense } from "react";
import { ArtisanList } from "~/components/artisans/artisan-list";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { ServiceListSkeleton } from "~/components/skeletons/service-list";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";
export default function ArtisanPage() {
  void api.artisan.getAllArtisans.prefetch();
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<ServiceListSkeleton />}>
        <ArtisanList />
      </Suspense>
    </HydrateClient>
  );
}
