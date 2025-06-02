"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

// Define the filter form values type
export type ArtisanFilterValues = {
  craft: string;
  subCraft: string;
  checkIn: string;
  checkOut: string;
  rating: number[];
  expertise: string[];
  education: string;
  training: string;
  certification: string;
  recognition: string;
};


export const ArtisanFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("craft");
  
  const { control, handleSubmit, watch, setValue } = useForm<ArtisanFilterValues>({
    defaultValues: {
      craft: "",
      subCraft: "",
      checkIn: "",
      checkOut: "",
      rating: [5, 4, 3, 2, 1], 
      expertise: ["GRANDMASTER", "MASTER", "CRAFTMAN", "APPRENTICE"],
      education: "",
      training: "",
      certification: "",
      recognition: "",
    },
  });

  const [crafts] = api.craft.getAllCrafts.useSuspenseQuery();

  const watchedCraft = useWatch({
    control: control,
    name: "craft",
    defaultValue: "",
  });

  const subCrafts = api.craft.getSubCraftsByCraftId.useQuery(
    { craftId: watchedCraft },
    { enabled: !!watchedCraft } 
  );

  useEffect(() => {
    if (searchParams) {
      const craft = searchParams.get("craft") ?? "";
      const subCraft = searchParams.get("subCraft") ?? "";
      const checkIn = searchParams.get("checkIn") ?? "";
      const checkOut = searchParams.get("checkOut") ?? "";
      const rating = searchParams.get("rating")?.split(",").map(Number) ?? [5, 4, 3, 2, 1];
      const expertise = searchParams.get("expertise")?.split(",") ?? 
        ["GRANDMASTER", "MASTER", "CRAFTMAN", "APPRENTICE"]; // Updated to uppercase
      const education = searchParams.get("education") ?? "";
      const training = searchParams.get("training") ?? "";
      const certification = searchParams.get("certification") ?? "";
      const recognition = searchParams.get("recognition") ?? "";

      setValue("craft", craft);
      setValue("subCraft", subCraft);
      setValue("checkIn", checkIn);
      setValue("checkOut", checkOut);
      setValue("rating", rating);
      setValue("expertise", expertise);
      setValue("education", education);
      setValue("training", training);
      setValue("certification", certification);
      setValue("recognition", recognition);
    }
  }, [searchParams, setValue]);

function handleCheckboxChange(field: "rating", value: number): void;
function handleCheckboxChange(field: "expertise", value: string): void;
function handleCheckboxChange(field: "rating" | "expertise", value: number | string): void {
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
      // Must be "expertise"
      const typedValues = currentValues as string[];
      const valueExists = typedValues.includes(value as string);
      const updatedValues = valueExists
        ? typedValues.filter(v => v !== value)
        : [...typedValues, value as string];
      setValue("expertise", updatedValues);
    }
  }
}

  const onSubmit = (data: ArtisanFilterValues) => {
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.craft) params.set("craft", data.craft);
    if (data.subCraft) params.set("subCraft", data.subCraft);
    if (data.checkIn) params.set("checkIn", data.checkIn);
    if (data.checkOut) params.set("checkOut", data.checkOut);
    if (data.rating.length) params.set("rating", data.rating.join(","));
    if (data.expertise.length) params.set("expertise", data.expertise.join(","));
    if (data.education) params.set("education", data.education);
    if (data.training) params.set("training", data.training);
    if (data.certification) params.set("certification", data.certification);
    if (data.recognition) params.set("recognition", data.recognition);

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>ARTISAN RESOURCES</b>
          </div>
          {[
            { id: "craft", label: "Craft" },
            { id: "expertise", label: "Expertise" },
            { id: "rating", label: "Rating" },
            { id: "credentials", label: "Credentials" },
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
          <TabsContent value="craft">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="col-span-1">
                <label className="mb-2 block">Selected Craft</label>
                <Controller
                  name="craft"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Craft --" />
                      </SelectTrigger>
                      <SelectContent>
                        {crafts.map((craft) => (
                          <SelectItem key={craft.craftId} value={craft.craftId}>
                            {craft.craftName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-1">
                <label className="mb-2 block">Selected Sub-Craft</label>
                <Controller
                  name="subCraft"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Sub Craft --" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCrafts.data?.map((subCraft) => (
                          <SelectItem key={subCraft.subCraftId} value={subCraft.subCraftId}>
                            {subCraft.subCraftName}
                          </SelectItem>
                        ))}
                        {subCrafts.isLoading && (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        )}
                        {!watchedCraft && (
                          <SelectItem value="loading" disabled>
                            Select a craft first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

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
                        onCheckedChange={() => handleCheckboxChange("rating", stars)}
                      />
                    )}
                  />
                  <label htmlFor={`${stars}stars`}>{stars} Stars</label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expertise" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { value: "GRANDMASTER", label: "Grandmaster" },
                { value: "MASTER", label: "Master Craftsman" },
                { value: "CRAFTMAN", label: "Craftsman" },
                { value: "APPRENTICE", label: "Apprentice" }
              ].map(
                (level) => (
                  <div key={level.value} className="flex items-center gap-2">
                    <Controller
                      name="expertise"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={level.value}
                          checked={field.value.includes(level.value)}
                          onCheckedChange={() => handleCheckboxChange("expertise", level.value)}
                        />
                      )}
                    />
                    <label htmlFor={level.value}>{level.label}</label>
                  </div>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="credentials">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                {
                  name: "education",
                  label: "Education",
                  options: [
                    { value: "NON_FORMAL", label: "Non-Formal Education" },
                    { value: "FORMAL", label: "Formal Education" },
                  ],
                },
                {
                  name: "training",
                  label: "Training",
                  options: [
                    { value: "NON_FORMAL", label: "Non-Formal Training" },
                    { value: "FORMAL", label: "Formal Training" },
                  ],
                },
                {
                  name: "certification",
                  label: "Certification",
                  options: [
                    { value: "NONE", label: "No Certification" },
                    { value: "PROFESSIONAL", label: "Professional Bodies" },
                    { value: "ASSOCIATION", label: "Trade Associations" },
                    { value: "WORKSHOP", label: "Workshops" },
                  ],
                },
                {
                  name: "recognition",
                  label: "Recognition",
                  options: [
                    { value: "STATE", label: "State Level (Craftsmanship)" },
                    { value: "NATIONAL", label: "National Level (Padma Shri)" },
                    { value: "INTERNATIONAL", label: "International Level" },
                  ],
                },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-2 block">{field.label}</label>
                  <Controller
                    name={field.name as keyof ArtisanFilterValues}
                    control={control}
                    render={({ field: formField }) => (
                      <Select
                        value={formField.value as string}
                        onValueChange={formField.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`-- ${field.label} --`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <div className="mt-8">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Now
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};