"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Search, MapPin, Star, Calendar, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";



export type LanguageFilterValues = {
  search: string;
  location: string;
  languages: string[];
  specializations: string[];
  rating: number[];
  minRate: string;
  maxRate: string;
  availability: string[];
};

export const LanguageFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  const { control, handleSubmit, watch, setValue } = useForm<LanguageFilterValues>({
    defaultValues: {
      search: "",
      location: "",
      languages: [],
      specializations: [],
      rating: [5, 4, 3, 2, 1],
      minRate: "",
      maxRate: "",
      availability: [],
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search") ?? "";
      const location = searchParams.get("location") ?? "";
      const languages = searchParams.getAll("language");
      const specializations = searchParams.getAll("specialization");
      const rating = searchParams.get("rating")?.split(",").map(Number) ?? [5, 4, 3, 2, 1];
      const minRate = searchParams.get("minRate") ?? "";
      const maxRate = searchParams.get("maxRate") ?? "";
      const availability = searchParams.getAll("availability");

      setValue("search", search);
      setValue("location", location);
      setValue("languages", languages);
      setValue("specializations", specializations);
      setValue("rating", rating);
      setValue("minRate", minRate);
      setValue("maxRate", maxRate);
      setValue("availability", availability);
    }
  }, [searchParams, setValue]);

  function handleCheckboxChange(field: "rating", value: number): void;
  function handleCheckboxChange(field: "languages", value: string): void;
  function handleCheckboxChange(field: "specializations", value: string): void;
  function handleCheckboxChange(field: "availability", value: string): void;
  function handleCheckboxChange(field: "rating" | "languages" | "specializations" | "availability", value: number | string): void {
    const currentValues = watch(field);
    
    if (Array.isArray(currentValues)) {
      if (field === "rating") {
        const typedValues = currentValues as number[];
        const valueExists = typedValues.includes(value as number);
        const updatedValues = valueExists
          ? typedValues.filter(v => v !== value)
          : [...typedValues, value as number];
        setValue("rating", updatedValues);
      } else {
        // Must be languages, specializations, or availability
        const typedValues = currentValues as string[];
        const valueExists = typedValues.includes(value as string);
        const updatedValues = valueExists
          ? typedValues.filter(v => v !== value)
          : [...typedValues, value as string];
        setValue(field, updatedValues);
      }
    }
  }

  const onSubmit = (data: LanguageFilterValues) => {
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.search) params.set("search", data.search);
    if (data.location) params.set("location", data.location);
    
    // Add array values as multiple parameters with the same name
    if (data.languages && data.languages.length > 0) {
      data.languages.forEach(lang => params.append("language", lang));
    }
    
    if (data.specializations && data.specializations.length > 0) {
      data.specializations.forEach(spec => params.append("specialization", spec));
    }
    
    if (data.rating && data.rating.length > 0) {
      params.set("rating", data.rating.join(","));
    }
    
    if (data.minRate) params.set("minRate", data.minRate);
    if (data.maxRate) params.set("maxRate", data.maxRate);
    
    if (data.availability && data.availability.length > 0) {
      data.availability.forEach(day => params.append("availability", day));
    }

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>LANGUAGE SERVICES</b>
          </div>
          {[
            { id: "general", label: "General" },
            { id: "languages", label: "Languages" },
            { id: "specialization", label: "Specialization" },
            { id: "rating", label: "Rating" },
            { id: "availability", label: "Availability" },
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="col-span-2">
                <label className="mb-2 flex items-center gap-1">
                  <Search className="h-4 w-4" /> Search
                </label>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Search by name or keyword..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="col-span-2">
                <label className="mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Location
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter city or region..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Minimum Rate ($/hr)
                </label>
                <Controller
                  name="minRate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Min hourly rate"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Maximum Rate ($/hr)
                </label>
                <Controller
                  name="maxRate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Max hourly rate"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="languages">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {[
                "English", "Hindi", "Kashmiri", "Urdu", "Arabic", 
                "French", "Spanish", "German", "Chinese", "Japanese",
                "Russian", "Italian", "Portuguese", "Korean", "Turkish"
              ].map((language) => (
                <div key={language} className="flex items-center gap-2">
                  <Controller
                    name="languages"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`lang-${language}`}
                        checked={field.value.includes(language)}
                        onCheckedChange={() => handleCheckboxChange("languages", language)}
                      />
                    )}
                  />
                  <label htmlFor={`lang-${language}`}>{language}</label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialization">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                "Translation",
                "Interpretation",
                "Language Teaching",
                "Cultural Training",
                "Document Translation",
                "Technical Translation",
                "Medical Translation",
                "Legal Translation",
                "Business Interpretation",
                "Conference Interpretation",
                "Subtitling",
                "Localization",
              ].map((spec) => (
                <div key={spec} className="flex items-center gap-2">
                  <Controller
                    name="specializations"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`spec-${spec}`}
                        checked={field.value.includes(spec)}
                        onCheckedChange={() => handleCheckboxChange("specializations", spec)}
                      />
                    )}
                  />
                  <label htmlFor={`spec-${spec}`}>{spec}</label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rating" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`${stars}stars`}
                        checked={field.value.includes(stars)}
                        onCheckedChange={() => handleCheckboxChange("rating", stars)}
                      />
                    )}
                  />
                  <label htmlFor={`${stars}stars`} className="flex items-center gap-1">
                    {stars} {stars === 1 ? "Star" : "Stars"}
                    <div className="ml-1 flex">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="availability">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                "Monday", "Tuesday", "Wednesday", "Thursday", 
                "Friday", "Saturday", "Sunday"
              ].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <Controller
                    name="availability"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`avail-${day}`}
                        checked={field.value.includes(day)}
                        onCheckedChange={() => handleCheckboxChange("availability", day)}
                      />
                    )}
                  />
                  <label htmlFor={`avail-${day}`} className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          <div className="mt-8">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Translators
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};