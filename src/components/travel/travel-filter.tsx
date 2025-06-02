"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { MapPin, Search, Globe, Briefcase } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select";
import { api } from "~/trpc/react";

const PRICE_RANGE_LABELS = {
  "$": "$ (Budget)",
  "$$": "$$ (Moderate)",
  "$$$": "$$$ (Premium)",
  "$$$$": "$$$$ (Luxury)",
};

export const TravelPlannerFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  const [filterOptions] = api.travelPlanner.getTravelPlannerFilterOptions.useSuspenseQuery();

  const { control, handleSubmit, setValue, reset } = useForm<TravelPlannerFilterValues>({
    defaultValues: {
      search: "",
      location: "",
      priceRange: "",
      language: "",
      speciality: "",
    },
  });

  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search") ?? "";
      const location = searchParams.get("location") ?? "";
      const priceRange = searchParams.get("priceRange") ?? "";
      const language = searchParams.get("language") ?? "";
      const speciality = searchParams.get("speciality") ?? "";

      setValue("search", search);
      setValue("location", location);
      setValue("priceRange", priceRange);
      setValue("language", language);
      setValue("speciality", speciality);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: TravelPlannerFilterValues) => {
    const params = new URLSearchParams();
    
    if (data.search) params.set("search", data.search);
    if (data.location) params.set("location", data.location);
    if (data.priceRange) params.set("priceRange", data.priceRange);
    if (data.language) params.set("language", data.language);
    if (data.speciality) params.set("speciality", data.speciality);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      search: "",
      location: "",
      priceRange: "",
      language: "",
      speciality: "",
    });
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>TRAVEL PLANNERS</b>
          </div>
          {[
            { id: "general", label: "General Search" },
            { id: "expertise", label: "Expertise & Languages" },
            { id: "location", label: "Location & Price" },
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
                  <Search className="h-4 w-4" /> Search Travel Planners
                </label>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Search by name or description..."
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
                        <SelectItem value="value" disabled>All Locations</SelectItem>
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

          <TabsContent value="expertise">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Speciality
                </label>
                <Controller
                  name="speciality"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select speciality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value" disabled>All Specialities</SelectItem>
                        {filterOptions.specialities.map((speciality) => (
                          <SelectItem key={speciality} value={speciality}>
                            {speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Language
                </label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value" disabled>All Languages</SelectItem>
                        {filterOptions.languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <SelectItem value="value" disabled>All Price Ranges</SelectItem>
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

          <div className="mt-8 flex gap-4">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Travel Planners
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