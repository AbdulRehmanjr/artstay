"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  MapPin,
  Clock,
  Tag,
  ShoppingBag,
  Truck,
  Star,
} from "lucide-react";
import dayjs from "dayjs";

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

const getCategoryLabel = (categoryId: string): string => {
  if (categoryId.startsWith("other: ")) {
    return categoryId.substring(7);
  }

  const category = PRODUCT_CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.label : categoryId;
};

export const ShopList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFilter = searchParams.get("search");
  const categoryFilter = searchParams.get("category");
  const handmadeFilter = searchParams.get("handmade");
  const giCertifiedFilter = searchParams.get("giCertified") === "true";
  const locationFilter = searchParams.get("location");

  const [shops] = api.shop.getAllShops.useSuspenseQuery();

  // Apply filters to shops
  const filteredShops = useMemo(() => {
    // If no filters are applied, return all shops
    if (
      !searchFilter &&
      !categoryFilter &&
      !handmadeFilter &&
      !giCertifiedFilter &&
      !locationFilter
    ) {
      return shops;
    }

    return shops.filter((shop) => {
      // Search filter (search in shop name, description, business name)
      if (
        searchFilter &&
        !(
          shop.shopName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          shop.businessName
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchFilter.toLowerCase())
        )
      ) {
        return false;
      }

      // Category filter
      if (categoryFilter && !shop.productCategories.includes(categoryFilter)) {
        return false;
      }

      // Handmade filter
      if (handmadeFilter && shop.isHandmade !== handmadeFilter) {
        return false;
      }

      // GI Certified filter
      if (giCertifiedFilter && !shop.isGICertified) {
        return false;
      }

      // Location filter (search in address, city, state, country)
      if (
        locationFilter &&
        !(
          shop.address.toLowerCase().includes(locationFilter.toLowerCase()) ||
          shop.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
          shop.state.toLowerCase().includes(locationFilter.toLowerCase()) ||
          shop.country.toLowerCase().includes(locationFilter.toLowerCase())
        )
      ) {
        return false;
      }

      // If passed all filters
      return true;
    });
  }, [
    shops,
    searchFilter,
    categoryFilter,
    handmadeFilter,
    giCertifiedFilter,
    locationFilter,
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2">
      {filteredShops.map((shop, index) => (
        <Card
          key={shop.shopId ?? index}
          className="group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
          onClick={() => router.push(`/shop/profile?shopId=${shop.shopId}`)}
        >
          <div className="relative">
            <div className="relative h-60 overflow-hidden">
              <Image
                src={shop.dp || "/placeholder-shop.jpg"}
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
              <h3 className="text-xl font-bold text-gray-900">
                {shop.shopName}
              </h3>
              <Badge variant="outline" className="text-xs font-normal">
                {dayjs(shop.createdAt).format("MMM YYYY")}
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
                <Badge variant="secondary" className="text-xs">
                  +{shop.productCategories.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex flex-col space-y-2 text-xs text-gray-600">
              <div className="flex items-center">
                <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">
                  {shop.address}, {shop.city}
                </span>
              </div>

              <div className="flex items-center">
                <Truck className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">
                  {shop.deliveryTime} delivery{" "}
                  {shop.deliveryFee !== "Free"
                    ? `(${shop.deliveryFee})`
                    : "(Free)"}
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
  );
};
