"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Define the filter form values type
export type FairFilterValues = {
  location: string;
  date: string;
};

export const FairFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  // Set up react-hook-form
  const { control, handleSubmit, setValue } = useForm<FairFilterValues>({
    defaultValues: {
      location: "",
      date: "",
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const location = searchParams.get("location") ?? "";
      const date = searchParams.get("date") ?? "";

      setValue("location", location);
      setValue("date", date);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: FairFilterValues) => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.location) params.set("location", data.location);
    if (data.date) params.set("date", data.date);

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>FAIR & EXHIBITIONS</b>
          </div>
          {[
            { id: "general", label: "Filter Events" },
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
                <label className="mb-2 block">Location</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter location"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block">Event Date</label>
                <Controller
                  name="date"
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

          <div className="mt-8">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Events
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};