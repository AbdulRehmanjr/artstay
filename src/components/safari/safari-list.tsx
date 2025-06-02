"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "~/components/ui/card";
import { MapPin } from "lucide-react";

export const SafariList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract filter values from search params
  const checkInFilter = searchParams.get("checkIn");
  const checkOutFilter = searchParams.get("checkOut");
  const ratingFilter = useMemo(() => 
    searchParams.get("rating")?.split(",").map(Number) ?? [], 
    [searchParams]
  );

  // Fetch all safaris
  const [safaris] = api.safari.getAllSafaris.useSuspenseQuery();

  // Apply filters to safaris
  const filteredSafaris = useMemo(() => {
    // If no filters are applied, return all safaris
    if (!checkInFilter && !checkOutFilter && ratingFilter.length === 0) {
      return safaris;
    }

    return safaris.filter(safari => {
      // For demo purposes, we're not implementing actual date filtering 
      // since SafariTour model would be needed for availability checks
      // In a real app, you'd check safari tour availability based on dates
      
      // Apply rating filter if any
      // Note: Since the safari model doesn't have ratings in your schema,
      // this is a placeholder. In a real app, you'd check against actual ratings.
      if (ratingFilter.length > 0) {
        // Placeholder for rating filter - in a real implementation you would
        // check against actual safari ratings if they exist
        // const safariRating = safari.rating ?? 5;
        // return ratingFilter.includes(Math.floor(safariRating));
        
        // Since we don't have ratings in the model, we'll just pass this filter
        // Remove this in a real implementation and use the code above
        return true;
      }
      
      // If passed all filters
      return true;
    });
  }, [safaris, checkInFilter, checkOutFilter, ratingFilter]);

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredSafaris.length > 0 ? (
          filteredSafaris.map((safari, index) => (
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
                    src={safari.dp === '' ? '/placeholder.png' : safari.dp}
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No safaris found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};