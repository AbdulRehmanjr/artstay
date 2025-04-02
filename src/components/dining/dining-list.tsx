"use client";

import { api } from "~/trpc/react";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  MapPin,
  Utensils,
  Search,
  Filter,
  ChevronDown,
  Package,
} from "lucide-react";
import dayjs from "dayjs";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";


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
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<string>("newest");
//   const [priceRange, setPriceRange] = useState<string | null>(null);
  
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [restaurantData, { fetchNextPage, hasNextPage, isFetchingNextPage, refetch }] =
    api.dining.getAllRestaurants.useSuspenseInfiniteQuery(
      {
        limit: 8,
        // cursor: null,
        // Additional parameters could be added to your API for filtering:
        // search: searchTerm,
        // cuisine: selectedCuisine,
        // sortBy: sortBy,
        // priceRange: priceRange,
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

//   // Re-fetch when filters change
//   useEffect(() => {
//     void refetch();
//   }, [searchTerm, selectedCuisine, sortBy, priceRange, refetch]);

  const restaurants = useMemo(
    () => restaurantData?.pages.flatMap((page) => page.dinings) ?? [],
    [restaurantData],
  );

  return (
    <div className="px-4 py-8">      
      {/* Search and Filters */}
      {/* <div className="mb-8 space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for restaurants or cuisines..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select onValueChange={(value) => setSelectedCuisine(value === "all" ? null : value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuisines</SelectItem>

              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Price Range
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setPriceRange(null)}>
                  All Price Ranges
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("budget")}>
                  Inexpensive ($)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("moderate")}>
                  Moderate ($$)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("expensive")}>
                  Expensive ($$$)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("luxury")}>
                  Luxury ($$$$)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedCuisine && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Cuisine: {selectedCuisine}
              <button 
                onClick={() => setSelectedCuisine(null)} 
                className="ml-1 rounded-full p-1 hover:bg-gray-200"
              >
                ×
              </button>
            </Badge>
          )}
          
          {priceRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {priceRange === "budget" ? "Inexpensive ($)" : 
               priceRange === "moderate" ? "Moderate ($$)" : 
               priceRange === "expensive" ? "Expensive ($$$)" : "Luxury ($$$$)"}
              <button 
                onClick={() => setPriceRange(null)} 
                className="ml-1 rounded-full p-1 hover:bg-gray-200"
              >
                ×
              </button>
            </Badge>
          )}
          
          {(selectedCuisine ?? priceRange) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedCuisine(null);
                setPriceRange(null);
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div> */}

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {restaurants.map((restaurant, index) => (
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
              
              {/* Price level */}
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
              
              {/* Cuisine tags */}
              <div className="mb-3 flex flex-wrap gap-1">
                {restaurant.cuisine?.map((cuisineItem, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Utensils className="mr-1 h-3 w-3" />
                    {cuisineItem}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{restaurant.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* {restaurants.length === 0 && !isFetchingNextPage && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setSelectedCuisine(null);
              setPriceRange(null);
              setSortBy("newest");
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )} */}
      
      {/* Loading spinner and end of content indicator */}
      <div ref={ref} className="mt-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : hasNextPage ? (
          <div className="h-8" />
        ) : restaurants.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm text-gray-500">
            You&apos;ve reached the end of the list
          </div>
        ) : null}
      </div>
    </div>
  );
};