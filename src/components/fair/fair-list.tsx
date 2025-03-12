"use client";

import { api } from "~/trpc/react";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card } from "~/components/ui/card";
import { MapPin } from "lucide-react";
import { EventCardSkeleton } from "~/components/skeletons/service";

export const FairList = () => {
  const router = useRouter();
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [fairData, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.fair.getAllFairs.useSuspenseInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => {
          if (!lastPage.metadata.hasNextPage) return undefined;
          return Number(lastPage.metadata.cursor);
        },
      },
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const fairs = useMemo(
    () => fairData?.pages.flatMap((page) => page.fairs) ?? [],
    [fairData],
  );

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {fairs.map((fair, index) => (
          <Card
            key={fair.fairId ?? index}
            className="cursor-pointer overflow-hidden bg-white transition-shadow duration-300 hover:shadow-md"
            onClick={() => router.push(`/fair/profile?fairId=${fair.fairId}`)}
          >
            <div className="relative">
              <Badge className="absolute left-4 top-4 z-10">Featured</Badge>

              <div className="relative h-72">
                <Image
                  src={fair.dp}
                  alt={`${fair.firstName} ${fair.lastName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary">
                {fair.firstName} {fair.lastName}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {fair.description}
              </p>

              <div className="mt-4 flex items-center text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="text-sm">{fair.address}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div
        ref={ref}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {isFetchingNextPage ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </>
        ) : hasNextPage ? (
          <div className="h-8" />
        ) : fairs.length > 0 ? (
          <p className="text-center text-gray-500">No more fairs to load</p>
        ) : null}
      </div>
    </div>
  );
};
