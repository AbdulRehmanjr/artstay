"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  MapPin,
  Utensils,
  Package,
} from "lucide-react";
import dayjs from "dayjs";

const getPriceRangeSymbol = (priceRange: string) => {
  switch (priceRange) {
    case "$":
      return "Inexpensive";
    case "$$":
      return "Moderate";
    case "$$$":
      return "Expensive";
    case "$$$$":
      return "Luxury";
    default:
      return priceRange; 
  }
};

export const RestaurantList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const searchFilter = searchParams.get("search");
  const cuisineFilter = searchParams.get("cuisine");
  const priceRangeFilter = searchParams.get("priceRange");
  const locationFilter = searchParams.get("location");

  const [restaurants] = api.dining.getAllRestaurants.useSuspenseQuery();

  const filteredRestaurants = useMemo(() => {
    if (
      !searchFilter &&
      !cuisineFilter &&
      !priceRangeFilter &&
      !locationFilter
    ) {
      return restaurants;
    }

    return restaurants.filter((restaurant) => {
      if (
        searchFilter &&
        !(
          restaurant.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchFilter.toLowerCase())
        )
      ) {
        return false;
      }

      if (cuisineFilter && !restaurant.cuisine.includes(cuisineFilter)) {
        return false;
      }

      if (priceRangeFilter && restaurant.priceRange !== priceRangeFilter) {
        return false;
      }

      if (
        locationFilter &&
        !restaurant.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    restaurants,
    searchFilter,
    cuisineFilter,
    priceRangeFilter,
    locationFilter,
  ]);

  return (
    <div className="px-4 py-8">
      {((searchFilter ?? false) || (cuisineFilter ?? false) || (priceRangeFilter ?? false) || locationFilter) && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm font-medium">Active filters:</span>
          {searchFilter && (
            <Badge variant="secondary">Search: {searchFilter}</Badge>
          )}
          {cuisineFilter && (
            <Badge variant="secondary">Cuisine: {cuisineFilter}</Badge>
          )}
          {priceRangeFilter && (
            <Badge variant="secondary">Price: {getPriceRangeSymbol(priceRangeFilter)}</Badge>
          )}
          {locationFilter && (
            <Badge variant="secondary">Location: {locationFilter}</Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRestaurants.map((restaurant, index) => (
          <Card
            key={restaurant.restaurantId ?? index}
            className="group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
            onClick={() => router.push(`/dining/profile?restaurantId=${restaurant.restaurantId}`)}
          >
            <div className="relative">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={restaurant.image || '/placeholder.png'}
                  alt={restaurant.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              <div className="absolute bottom-3 right-3">
                <Badge variant="outline" className="bg-white/90 font-mono text-gray-800">
                  {getPriceRangeSymbol(restaurant.priceRange)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{restaurant.name}</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {dayjs(restaurant.createdAt).format('MMM YYYY')}
                </Badge>
              </div>
              
              <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                {restaurant.description}
              </p>
              
              <div className="mb-3 flex flex-wrap gap-1">
                {restaurant.cuisine?.slice(0, 3).map((cuisineItem, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Utensils className="mr-1 h-3 w-3" />
                    {cuisineItem}
                  </Badge>
                ))}
                {restaurant.cuisine?.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{restaurant.cuisine.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{restaurant.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRestaurants.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};