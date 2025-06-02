
"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { MapPin, Search, FileText, Users, Package, DollarSign } from "lucide-react";
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



type DocumentorFilterValues  = {
  search: string; 
  specialization: string;
  craftFocusArea: string;
  language: string;
  packageType: string;
  priceRange: string;
  isAvailable: boolean;
  isVerified: boolean;
}

export const DocumentorFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  const [filterOptions] = api.documentor.getDocumentorFilterOptions.useSuspenseQuery();

  // Set up react-hook-form
  const { control, handleSubmit, setValue, reset } = useForm<DocumentorFilterValues>({
    defaultValues: {
      search: "",
      specialization: "",
      craftFocusArea: "",
      language: "",
      packageType: "",
      priceRange: "",
      isAvailable: false,
      isVerified: false,
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search") ?? "";
      const specialization = searchParams.get("specialization") ?? "";
      const craftFocusArea = searchParams.get("craftFocusArea") ?? "";
      const language = searchParams.get("language") ?? "";
      const packageType = searchParams.get("packageType") ?? "";
      const priceRange = searchParams.get("priceRange") ?? "";
      const isAvailable = searchParams.get("isAvailable") === "true";
      const isVerified = searchParams.get("isVerified") === "true";

      setValue("search", search);
      setValue("specialization", specialization);
      setValue("craftFocusArea", craftFocusArea);
      setValue("language", language);
      setValue("packageType", packageType);
      setValue("priceRange", priceRange);
      setValue("isAvailable", isAvailable);
      setValue("isVerified", isVerified);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: DocumentorFilterValues) => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.search) params.set("search", data.search);
    if (data.specialization) params.set("specialization", data.specialization);
    if (data.craftFocusArea) params.set("craftFocusArea", data.craftFocusArea);
    if (data.language) params.set("language", data.language);
    if (data.packageType) params.set("packageType", data.packageType);
    if (data.priceRange) params.set("priceRange", data.priceRange);
    if (data.isAvailable) params.set("isAvailable", "true");
    if (data.isVerified) params.set("isVerified", "true");

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      search: "",
      specialization: "",
      craftFocusArea: "",
      language: "",
      packageType: "",
      priceRange: "",
      isAvailable: false,
      isVerified: false,
    });
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>CRAFT DOCUMENTORS</b>
          </div>
          {[
            { id: "general", label: "General Search" },
            { id: "expertise", label: "Expertise & Skills" },
            { id: "packages", label: "Packages & Pricing" },
            { id: "preferences", label: "Preferences" },
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
                  <Search className="h-4 w-4" /> Documentor Search
                </label>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Search documentors..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Language
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
                        <SelectItem value="none" disabled>All Languages</SelectItem>
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

          <TabsContent value="expertise">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Specialization
                </label>
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>All Specializations</SelectItem>
                        {filterOptions.specializations.map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Craft Focus Area
                </label>
                <Controller
                  name="craftFocusArea"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select craft focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>All Craft Areas</SelectItem>
                        {filterOptions.craftFocusAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Package Type
                </label>
                <Controller
                  name="packageType"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select package type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>All Package Types</SelectItem>
                        {filterOptions.packageTypes.map((packageType) => (
                          <SelectItem key={packageType} value={packageType}>
                            {packageType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Price Range
                </label>
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
                        <SelectItem value="none" disabled>All Price Ranges</SelectItem>
                        {filterOptions.priceRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isAvailable"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="isAvailable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Available Now
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="isVerified"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isVerified"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="isVerified"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Verified Documentors Only
                </label>
              </div>
            </div>
          </TabsContent>

          <div className="mt-8 flex gap-4">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Documentors
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