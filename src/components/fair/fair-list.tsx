"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "~/components/ui/card";
import { MapPin } from "lucide-react";


export const FairList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract filter values from search params
  const locationFilter = searchParams.get("location");
  const dateFilter = searchParams.get("date");

  // Fetch all fairs without pagination
  const [fairs] = api.fair.getAllFairs.useSuspenseQuery();

  // Apply filters to fairs
  const filteredFairs = useMemo(() => {
    // If no filters are applied, return all fairs
    if (!locationFilter && !dateFilter) {
      return fairs;
    }

    return fairs.filter(fair => {
      // Apply location filter if specified
      if (locationFilter && !fair.address.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
      
      // Note: We don't have FairEvents data, so we can't filter by date
      // If needed, this would be implemented with additional API data
      
      // If passed all filters
      return true;
    });
  }, [fairs, locationFilter, dateFilter]);

  return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {filteredFairs.length > 0 ? (
          filteredFairs.map((fair, index) => (
            <Card
              key={fair.fairId ?? index}
              className="cursor-pointer overflow-hidden bg-white transition-shadow duration-300 hover:shadow-md"
              onClick={() => router.push(`/fair/profile?fairId=${fair.fairId}`)}
            >
              <div className="relative">
                <Badge className="absolute left-4 top-4 z-10">Featured</Badge>

                <div className="relative h-72">
                  <Image
                    src={fair.dp || '/placeholder.png'}
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No fairs found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
  );
};