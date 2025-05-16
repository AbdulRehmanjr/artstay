import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import { MapPin, Star, Utensils, Clock } from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { DiningMenu } from "~/components/dining/booking/dining-menu";


type MenuCategory = "STARTER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE";

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

type PageProps = {
  searchParams: Promise<{ restaurantId: string }>;
};

export default async function RestaurantPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const restaurant: RestaurantDetailProps =
    await api.dining.getRestaurantDetail({
      restaurantId: paramProps.restaurantId,
    });

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
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
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
                    <span className="text-xs text-white/70">Cuisine Type</span>
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-white" />
                      <span className="text-base font-medium">
                        {restaurant.cuisine.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Price Range</span>
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
                  <span className="text-xs text-white/70">Operating Since</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-base font-medium">
                      {new Date(restaurant.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        },
                      )}
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
          <DiningMenu menu={restaurant.menu} />
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
