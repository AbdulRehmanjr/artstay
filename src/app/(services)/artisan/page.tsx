import { Suspense } from "react";
import { ArtisanList } from "~/components/artisans/artisan-list";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<p>loading...</p>}>
        <ArtisanList />
      </Suspense>
    </HydrateClient>
  );
}
