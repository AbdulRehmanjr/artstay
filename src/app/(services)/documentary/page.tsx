import { Suspense } from "react";
import { DocumentorFilter } from "~/components/documentary/documentary-filter";
import { DocumentorList } from "~/components/documentary/documtary-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function DocumentorListPage() {
  return (
    <HydrateClient>
      <DocumentorFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <DocumentorList />
      </Suspense>
    </HydrateClient>
  );
}
