"use client";

import { api } from "~/trpc/react";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { MapPin, Store } from "lucide-react";
import dayjs from "dayjs";

export const ShopList = () => {
    const router = useRouter();
    const { ref, entry } = useIntersection({
      root: null,
      threshold: 0.1,
      rootMargin: "100px",
    });
  
    const [shopData, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
      api.shop.getAllShops.useSuspenseInfiniteQuery(
        {
          limit: 8,
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
  
    const shops = useMemo(
      () => shopData?.pages.flatMap((page) => page.shops) ?? [],
      [shopData],
    );
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shops.map((shop, index) => (
            <Card
              key={shop.shopId ?? index}
              className="cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onClick={() =>
                router.push(`/shop/profile?shopId=${shop.shopId}`)
              }
            >
              <div className="relative">
                <div className="relative h-52">
                  <Image
                    src={shop.dp || '/placeholder-shop.jpg'}
                    alt={shop.shopName ?? 'Shop Image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </div>
  
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Store className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {dayjs(shop.createdAt).format('DD MMM YYYY')}
                  </span>
                </div>
  
                <h3 className="mt-2 text-xl font-semibold text-secondary line-clamp-1">
                  {shop.shopName}
                </h3>
  
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 min-h-[2.5rem]">
                  {shop.description}
                </p>
  
                <div className="mt-4 flex items-center text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="text-xs line-clamp-1">{shop.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Loading spinner and end of content indicator */}
        <div ref={ref} className="mt-8 flex justify-center">
          {isFetchingNextPage ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          ) : hasNextPage ? (
            <div className="h-8" />
          ) : shops.length > 0 ? (
            <p className="text-center text-gray-500">No more shops to load</p>
          ) : null}
        </div>
      </div>
    );
  };
