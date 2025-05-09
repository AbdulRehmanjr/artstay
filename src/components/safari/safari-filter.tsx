"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Define the filter form values type
export type SafariFilterValues = {
  checkIn: string;
  checkOut: string;
  rating: number[];
};

export const SafariFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("dates");

  // Set up react-hook-form
  const { control, handleSubmit, watch, setValue } = useForm<SafariFilterValues>({
    defaultValues: {
      checkIn: "",
      checkOut: "",
      rating: [5, 4, 3, 2, 1], // Default all checked
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const checkIn = searchParams.get("checkIn") ?? "";
      const checkOut = searchParams.get("checkOut") ?? "";
      const rating = searchParams.get("rating")?.split(",").map(Number) ?? [5, 4, 3, 2, 1];

      setValue("checkIn", checkIn);
      setValue("checkOut", checkOut);
      setValue("rating", rating);
    }
  }, [searchParams, setValue]);

  // Type-safe checkbox change handler
  const handleCheckboxChange = (value: number) => {
    const currentValues = watch("rating");
    const valueExists = currentValues.includes(value);
    
    // Toggle the value
    if (valueExists) {
      setValue("rating", currentValues.filter(v => v !== value));
    } else {
      setValue("rating", [...currentValues, value]);
    }
  };

  const onSubmit = (data: SafariFilterValues) => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.checkIn) params.set("checkIn", data.checkIn);
    if (data.checkOut) params.set("checkOut", data.checkOut);
    if (data.rating.length) params.set("rating", data.rating.join(","));

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>SAFARI EXPERIENCES</b>
          </div>
          {[
            { id: "dates", label: "Dates" },
            { id: "rating", label: "Rating" },
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
          <TabsContent value="dates">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block">Check in</label>
                <Controller
                  name="checkIn"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      placeholder="yyyy-mm-dd"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block">Check out</label>
                <Controller
                  name="checkOut"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      placeholder="yyyy-mm-dd"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
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
                        onCheckedChange={() => handleCheckboxChange(stars)}
                      />
                    )}
                  />
                  <label htmlFor={`${stars}stars`}>{stars} Stars</label>
                </div>
              ))}
            </div>
          </TabsContent>

          <div className="mt-8">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Safari
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};