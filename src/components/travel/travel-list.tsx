"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  MapPin,
  Globe,
  Briefcase,
  Package,
  DollarSign,
} from "lucide-react";

const getPriceRangeSymbol = (priceRange: string) => {
  switch (priceRange) {
    case "$":
      return "Budget";
    case "$$":
      return "Moderate";
    case "$$$":
      return "Premium";
    case "$$$$":
      return "Luxury";
    default:
      return priceRange; 
  }
};

export const TravelPlannerList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const searchFilter = searchParams.get("search");
  const locationFilter = searchParams.get("location");
  const priceRangeFilter = searchParams.get("priceRange");
  const languageFilter = searchParams.get("language");
  const specialityFilter = searchParams.get("speciality");

  const [travelPlanners] = api.travelPlanner.getAllTravelPlanners.useSuspenseQuery();

  const filteredTravelPlanners = useMemo(() => {
    if (
      !searchFilter &&
      !locationFilter &&
      !priceRangeFilter &&
      !languageFilter &&
      !specialityFilter
    ) {
      return travelPlanners;
    }

    return travelPlanners.filter((planner) => {
      if (
        searchFilter &&
        !(
          planner.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          planner.description.toLowerCase().includes(searchFilter.toLowerCase())
        )
      ) {
        return false;
      }

      if (locationFilter && planner.location !== locationFilter) {
        return false;
      }

      if (priceRangeFilter && planner.priceRange !== priceRangeFilter) {
        return false;
      }

      if (languageFilter && !planner.language.includes(languageFilter)) {
        return false;
      }

      if (specialityFilter && !planner.speciality.includes(specialityFilter)) {
        return false;
      }

      return true;
    });
  }, [
    travelPlanners,
    searchFilter,
    locationFilter,
    priceRangeFilter,
    languageFilter,
    specialityFilter,
  ]);

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTravelPlanners.map((planner, index) => (
          <Card
            key={planner.travelPlanerId ?? index}
            className="group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
            onClick={() => router.push(`/travel/profile?travelPlannerId=${planner.travelPlanerId}`)}
          >
            <div className="relative">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={planner.dp || '/placeholder.png'}
                  alt={planner.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              <div className="absolute bottom-3 right-3">
                <Badge variant="outline" className="bg-white/90 text-gray-800">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {getPriceRangeSymbol(planner.priceRange)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
               <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{planner.name}</h3>
              
              <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                {planner.description}
              </p>
              
              <div className="mb-3 flex flex-wrap gap-1">
                {planner.speciality?.slice(0, 2).map((spec, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Briefcase className="mr-1 h-3 w-3" />
                    {spec}
                  </Badge>
                ))}
                {planner.speciality?.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{planner.speciality.length - 2} more
                  </Badge>
                )}
              </div>

              <div className="mb-2 flex flex-wrap gap-1">
                {planner.language?.slice(0, 2).map((lang, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    <Globe className="mr-1 h-3 w-3" />
                    {lang}
                  </Badge>
                ))}
                {planner.language?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{planner.language.length - 2} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{planner.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredTravelPlanners.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No travel planners found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};