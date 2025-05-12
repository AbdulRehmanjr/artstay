"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { MapPin, Search, Utensils } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";

const PRICE_RANGE_LABELS = {
  "$": "$ (Budget)",
  "$$": "$$ (Moderate)",
  "$$$": "$$$ (Expensive)",
  "$$$$": "$$$$ (Luxury)",
};

export const DiningFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  const [filterOptions] = api.dining.getDiningFilterOptions.useSuspenseQuery();

  // Set up react-hook-form
  const { control, handleSubmit, setValue, reset } = useForm<DiningFilterValues>({
    defaultValues: {
      search: "",
      cuisine: "",
      priceRange: "",
      location: "",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search") ?? "";
      const cuisine = searchParams.get("cuisine") ?? "";
      const priceRange = searchParams.get("priceRange") ?? "";
      const location = searchParams.get("location") ?? "";
      const isVegetarian = searchParams.get("isVegetarian") === "true";
      const isVegan = searchParams.get("isVegan") === "true";
      const isGlutenFree = searchParams.get("isGlutenFree") === "true";

      setValue("search", search);
      setValue("cuisine", cuisine);
      setValue("priceRange", priceRange);
      setValue("location", location);
      setValue("isVegetarian", isVegetarian);
      setValue("isVegan", isVegan);
      setValue("isGlutenFree", isGlutenFree);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: DiningFilterValues) => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.search) params.set("search", data.search);
    if (data.cuisine) params.set("cuisine", data.cuisine);
    if (data.priceRange) params.set("priceRange", data.priceRange);
    if (data.location) params.set("location", data.location);
    if (data.isVegetarian) params.set("isVegetarian", "true");
    if (data.isVegan) params.set("isVegan", "true");
    if (data.isGlutenFree) params.set("isGlutenFree", "true");

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      search: "",
      cuisine: "",
      priceRange: "",
      location: "",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    });
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>DINING VOYAGE</b>
          </div>
          {[
            { id: "general", label: "General Search" },
            { id: "cuisine", label: "Cuisine & Price" },
            { id: "dietary", label: "Dietary Preferences" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:text-primary"
            >
              <span className="mr-2">+</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur">
          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4" /> Restaurant Search
                </label>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Search restaurants..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaue" disabled>All Locations</SelectItem>
                        {filterOptions.locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cuisine">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Utensils className="h-4 w-4" /> Cuisine Type
                </label>
                <Controller
                  name="cuisine"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaue" disabled>All Cuisines</SelectItem>
                        {filterOptions.cuisines.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block">Price Range</label>
                <Controller
                  name="priceRange"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaue" disabled>All Price Ranges</SelectItem>
                        {filterOptions.priceRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {PRICE_RANGE_LABELS[range as keyof typeof PRICE_RANGE_LABELS] || range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dietary">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="isVegetarian"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isVegetarian"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="isVegetarian"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Vegetarian Options Only
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="isVegan"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isVegan"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="isVegan"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Vegan Options Only
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="isGlutenFree"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isGlutenFree"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="isGlutenFree"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Gluten-Free Options Only
                </label>
              </div>
            </div>
          </TabsContent>

          <div className="mt-8 flex gap-4">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Restaurants
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};