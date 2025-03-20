import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Utensils,
  Clock,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// Define MenuCategory type
type MenuCategory = "STARTER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE";

// Define menu item props
type RestaurantMenuProps = {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Define restaurant detail props
type RestaurantDetailProps = {
  restaurantId: string;
  name: string;
  description: string;
  location: string;
  cuisine: string[];
  priceRange: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  menu: RestaurantMenuProps[];
};

// Map for category display names
const CATEGORY_LABELS: Record<MenuCategory, string> = {
  "STARTER": "Starters",
  "MAIN_COURSE": "Main Courses",
  "DESSERT": "Desserts",
  "BEVERAGE": "Beverages"
};

// Map for spicy level colors
const spicyColorMap: Record<number, string> = {
  1: "border-red-400 text-red-400",
  2: "border-red-500 text-red-500",
  3: "border-red-500 text-red-500",
  4: "border-red-600 text-red-600",
  5: "border-red-600 text-red-600",
};

// Spicy level labels
const SPICY_LEVELS = [
  { value: 0, label: "Not Spicy" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hot" },
  { value: 4, label: "Very Hot" },
  { value: 5, label: "Extreme" },
];

type PageProps = {
  searchParams: Promise<{ restaurantId: string }>;
};

export default async function RestaurantPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const restaurant: RestaurantDetailProps = await api.dining.getRestaurantDetail({
    restaurantId: paramProps.restaurantId,
  });

  // Group menu items by category
  const categorizedMenu = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, RestaurantMenuProps[]>);

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={restaurant.image || "/placeholder.png"}
              alt={restaurant.name}
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-3xl font-semibold text-white">
                {restaurant.name}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info" },
              { id: "menu", label: "Menu" },
              { id: "reviews", label: "Reviews" },
              { id: "reservation", label: "Reservation" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <span className="mr-2">+</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white/90 p-6 text-gray-900 shadow-lg backdrop-blur">
        <TabsContent value="general" className="grid gap-6">
          <HeadlingUnderline title="Restaurant Information" />
          <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Rating - We'll use a placeholder rating of 4.5 since it's not in the data model */}
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <Star
                            key={index}
                            className={`h-6 w-6 transition-colors duration-200 ${
                              index < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : index === 4 
                                  ? "fill-yellow-400 text-yellow-400 opacity-50" 
                                  : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="ml-2 text-lg font-semibold">4.5</span>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">
                      Cuisine Type
                    </span>
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-white" />
                      <span className="text-base font-medium">
                        {restaurant.cuisine.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">
                      Price Range
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">
                    Operating Since
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-base font-medium">
                      {new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{restaurant.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Restaurant
            </h2>
            <p className="text-base leading-relaxed text-gray-900">
              {restaurant.description || "No description available."}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="menu" className="grid gap-6">
          <HeadlingUnderline title="Our Menu" />
          
          <div className="space-y-8">
            {/* Show all categories by default */}
            {(Object.keys(categorizedMenu) as MenuCategory[]).map((category) => (
              <div key={category} className="space-y-4">
                <div className={`flex items-center justify-between rounded-lg p-4 shadow-md mb-4 ${
                  category === "STARTER" ? "bg-gradient-to-r from-amber-500 to-amber-300" :
                  category === "MAIN_COURSE" ? "bg-gradient-to-r from-orange-600 to-orange-400" :
                  category === "DESSERT" ? "bg-gradient-to-r from-pink-600 to-pink-400" :
                  "bg-gradient-to-r from-blue-600 to-blue-400"
                }`}>
                  <div className="flex items-center gap-2">
                    <Utensils className="text-white h-6 w-6" />
                    <h3 className="text-2xl font-bold text-white">{CATEGORY_LABELS[category]}</h3>
                  </div>
                  <Badge className="bg-white text-gray-800 text-sm font-medium px-3 py-1">{categorizedMenu[category].length} items</Badge>
                </div>
                
                <div className="grid gap-6">
                  {categorizedMenu[category].map((item) => (
                    <Card key={item.menuItemId} className="overflow-hidden border shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        <div className="relative h-60 md:h-full">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <CardContent className="flex flex-col justify-between p-6 md:col-span-2 lg:col-span-3">
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-xl font-medium">{item.name}</h4>
                              <Badge className="bg-primary text-lg">${item.price.toFixed(2)}</Badge>
                            </div>
                            
                            <div className="mb-4 flex flex-wrap gap-2">
                              {item.isVegetarian && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="border-green-500 bg-green-500/20 text-green-800">Vegetarian</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Vegetarian dish</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {item.isVegan && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="border-green-600 bg-green-600/20 text-green-900">Vegan</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Vegan dish</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {item.isGlutenFree && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="border-yellow-500 bg-yellow-500/20 text-yellow-800">Gluten Free</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Gluten free dish</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {item.spicyLevel > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className={`${spicyColorMap[item.spicyLevel] ?? ""}`}>
                                        Spicy: {Array(item.spicyLevel).fill("🌶️").join("")}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{SPICY_LEVELS.find((l) => l.value === item.spicyLevel)?.label ?? "Spicy"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            <p className="text-gray-700">{item.description}</p>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {categorizedMenu[category].length === 0 && (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <p className="text-gray-500">No items in this category</p>
                  </div>
                )}
              </div>
            ))}
            
            {Object.keys(categorizedMenu).length === 0 && (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-500">No menu items available</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <HeadlingUnderline title="Customer Reviews" />
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">Reviews coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reservation" className="grid gap-8">
          <HeadlingUnderline title="Make a Reservation" />
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">Reservation system coming soon</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}