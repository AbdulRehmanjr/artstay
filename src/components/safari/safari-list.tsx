"use client";

import { api } from "~/trpc/react";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export const SafariList = () => {
  const router = useRouter();
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [safariData, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.safari.getAllSafaris.useSuspenseInfiniteQuery(
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

  const safaris = useMemo(
    () => safariData?.pages.flatMap((page) => page.safaris) ?? [],
    [safariData],
  );

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {safaris.map((safari, index) => (
          <Card
            key={safari.safariId ?? index}
            className="cursor-pointer overflow-hidden bg-white transition-shadow duration-300 hover:shadow-md"
            onClick={() =>
              router.push(`/safari/profile?safariId=${safari.safariId}`)
            }
          >
            <div className="relative">
              <Badge className="absolute left-4 top-4 z-10">Featured</Badge>

              <div className="relative h-72">
                <Image
                  src={safari.dp}
                  alt={`${safari.firstName} ${safari.lastName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary">
                {safari.firstName} {safari.lastName}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {safari.description}
              </p>

              <div className="mt-4 flex items-center text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="text-sm">{safari.address}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Loading spinner and end of content indicator */}
      <div ref={ref} className="mt-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : hasNextPage ? (
          <div className="h-8" />
        ) : safaris.length > 0 ? (
          <p className="text-center text-gray-500">No more safaris to load</p>
        ) : null}
      </div>
    </div>
  );
};
