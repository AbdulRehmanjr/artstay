import { Suspense } from "react";
import { ArtisanForm } from "~/components/join/artisan-form";
import { HydrateClient } from "~/trpc/server";


export const dynamic = 'force-dynamic'
export default function ArtisanJoinPage() {
  return (
    <HydrateClient>
      <div className="space-y-5">
        <h3 className="font-heading text-3xl">
          Enter <span className="text-secondary">Your General Information</span>
        </h3>
        <Suspense fallback={<p>loading...</p>}>
          <ArtisanForm />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
