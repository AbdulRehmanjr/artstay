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
  Store, 
  Clock, 
  Tag, 
  ShoppingBag, 
  Package, 
  Search, 
  ChevronDown, 
  Truck, 
  Star, 
  Filter
} from "lucide-react";
import dayjs from "dayjs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Product categories from the registration form
const PRODUCT_CATEGORIES = [
  { id: "pashmina", label: "Pashmina & Woolen Products" },
  { id: "embroidery", label: "Embroidery & Textiles" },
  { id: "papierMache", label: "Papier-Mâché Artworks" },
  { id: "woodCarving", label: "Wood Carving & Furniture" },
  { id: "copperware", label: "Copperware & Metal Engraving" },
  { id: "pottery", label: "Pottery & Ceramics" },
  { id: "wickerwork", label: "Wickerwork & Basketry" },
  { id: "khatamband", label: "Khatamband & Woodwork" },
  { id: "jewelry", label: "Handmade Jewelry" },
  { id: "leather", label: "Leather Goods" },
];

// Helper function to get category label by id
const getCategoryLabel = (categoryId: string): string => {
  if (categoryId.startsWith("other: ")) {
    return categoryId.substring(7);
  }
  
  const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.label : categoryId;
};

export const ShopList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterHandmade, setFilterHandmade] = useState<string | null>(null);
  const [filterGI, setFilterGI] = useState<boolean | null>(null);
  
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [shopData, { fetchNextPage, hasNextPage, isFetchingNextPage, refetch }] =
    api.shop.getAllShops.useSuspenseInfiniteQuery(
      {
        limit: 8,
        // search: searchTerm,
        // category: selectedCategory,
        // sortBy: sortBy,
        // handmadeFilter: filterHandmade,
        // giCertified: filterGI,
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

  // Re-fetch when filters change
  useEffect(() => {
    void refetch();
  }, [searchTerm, selectedCategory, sortBy, filterHandmade, filterGI, refetch]);

  const shops = useMemo(
    () => shopData?.pages.flatMap((page) => page.shops) ?? [],
    [shopData],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">ArtStay Marketplace</h1>
        <p className="text-lg text-gray-600">Discover authentic Kashmiri handicrafts from our verified vendors</p>
      </div>
      
      {/* Search and Filters */}
      {/* <div className="mb-8 space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for shops or products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterHandmade(null)}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterHandmade("Yes")}>
                  Handmade Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterHandmade("Mixed")}>
                  Mixed Products
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterGI(null)}>
                  All Certifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterGI(true)}>
                  GI-Certified Only
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        

        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {getCategoryLabel(selectedCategory)}
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="ml-1 rounded-full p-1 hover:bg-gray-200"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterHandmade && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filterHandmade === "Yes" ? "Handmade Only" : "Mixed Products"}
              <button 
                onClick={() => setFilterHandmade(null)} 
                className="ml-1 rounded-full p-1 hover:bg-gray-200"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterGI === true && (
            <Badge variant="secondary" className="flex items-center gap-1">
              GI-Certified
              <button 
                onClick={() => setFilterGI(null)} 
                className="ml-1 rounded-full p-1 hover:bg-gray-200"
              >
                ×
              </button>
            </Badge>
          )}
          
          {(selectedCategory || filterHandmade || filterGI !== null) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedCategory(null);
                setFilterHandmade(null);
                setFilterGI(null);
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div> */}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shops.map((shop, index) => (
          <Card
            key={shop.shopId ?? index}
            className="group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
            onClick={() => router.push(`/shop/profile?shopId=${shop.shopId}`)}
          >
            <div className="relative">
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={shop.dp || '/placeholder-shop.jpg'}
                  alt={shop.shopName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              {/* Badges overlay */}
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                {shop.isGICertified && (
                  <Badge className="bg-blue-600 text-white">
                    <Star className="mr-1 h-3 w-3" /> GI Certified
                  </Badge>
                )}
                {shop.isHandmade === "Yes" && (
                  <Badge className="bg-amber-600 text-white">100% Handmade</Badge>
                )}
              </div>
              
              {/* Quick info overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="text-sm font-medium">{shop.vendorType}</div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-3 w-3" />
                  {shop.shopTiming}
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{shop.shopName}</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {dayjs(shop.createdAt).format('MMM YYYY')}
                </Badge>
              </div>
              
              <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                {shop.description}
              </p>
              
              {/* Category tags */}
              <div className="mb-3 flex flex-wrap gap-1">
                {shop.productCategories.slice(0, 3).map((category, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {getCategoryLabel(category)}
                  </Badge>
                ))}
                {shop.productCategories.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{shop.productCategories.length - 3} more</Badge>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1">{shop.address}, {shop.city}</span>
                </div>
                
                <div className="flex items-center">
                  <Truck className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1">
                    {shop.deliveryTime} delivery {shop.deliveryFee !== "Free" ? `(${shop.deliveryFee})` : "(Free)"}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <ShoppingBag className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                  <span>{shop.stockAvailability}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {shops.length === 0 && !isFetchingNextPage && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No shops found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
              setFilterHandmade(null);
              setFilterGI(null);
              setSortBy("newest");
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}
      
      {/* Loading spinner and end of content indicator */}
      <div ref={ref} className="mt-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : hasNextPage ? (
          <div className="h-8" />
        ) : shops.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm text-gray-500">
            You&apos;ve reached the end of the list
          </div>
        ) : null}
      </div>
    </div>
  );
};