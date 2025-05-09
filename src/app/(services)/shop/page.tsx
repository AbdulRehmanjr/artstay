import { Suspense } from "react";
import { ShopList } from "~/components/shop/shop-list";
import { ShopFilter } from "~/components/shop/shop-filter";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function ArtisanPage() {
  return (
    <HydrateClient>
      <ShopFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <ShopList />
      </Suspense>
    </HydrateClient>
  );
}
