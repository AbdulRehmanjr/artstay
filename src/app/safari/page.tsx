import { Suspense } from "react";
import { ArtisanFilter } from "~/components/artisans/filter-tab";
import { SafariList } from "~/components/safari/safari-list";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ArtisanFilter />
      <Suspense fallback={<p>loaing...</p>}>
        <SafariList />
      </Suspense>
    </HydrateClient>
  );
}
