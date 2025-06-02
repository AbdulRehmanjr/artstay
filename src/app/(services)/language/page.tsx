import { Suspense } from "react";
import { LanguageFilter } from "~/components/language/filter-tab";
import { LanguageList } from "~/components/language/language-list";
import { EventCardSkeleton } from "~/components/skeletons/service";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = 'force-dynamic'
export default function LanguageService() {
  void api.language.getAll()
  return (
    <HydrateClient>
      <LanguageFilter />
      <Suspense fallback={<EventCardSkeleton/>}>
        <LanguageList />
      </Suspense>
    </HydrateClient>
  );
}
