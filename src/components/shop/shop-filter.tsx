"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { MapPin, Search, ShoppingBag, Tag } from "lucide-react";
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

// Product category options
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

// Define the filter form values type
export type ShopFilterValues = {
  search: string;
  category: string;
  handmade: string;
  giCertified: boolean;
  location: string;
};

export const ShopFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  // Set up react-hook-form
  const { control, handleSubmit, setValue } = useForm<ShopFilterValues>({
    defaultValues: {
      search: "",
      category: "",
      handmade: "",
      giCertified: false,
      location: "",
    },
  });

  // Initialize form with URL params if any
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search") ?? "";
      const category = searchParams.get("category") ?? "";
      const handmade = searchParams.get("handmade") ?? "";
      const giCertified = searchParams.get("giCertified") === "true";
      const location = searchParams.get("location") ?? "";

      setValue("search", search);
      setValue("category", category);
      setValue("handmade", handmade);
      setValue("giCertified", giCertified);
      setValue("location", location);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: ShopFilterValues) => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    // Only add non-empty values to the URL
    if (data.search) params.set("search", data.search);
    if (data.category) params.set("category", data.category);
    if (data.handmade) params.set("handmade", data.handmade);
    if (data.giCertified) params.set("giCertified", "true");
    if (data.location) params.set("location", data.location);

    // Update URL with filter params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="-mt-24">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          <div className="rounded-b-none rounded-t-lg bg-secondary px-4 py-2 font-text text-lg text-white z-[101] p-3">
            <b>SHOP DIRECTORY</b>
          </div>
          {[
            { id: "general", label: "General Search" },
            { id: "category", label: "Product Category" },
            { id: "certification", label: "Certification" },
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
                <label className="mb-2  flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> Shop or Product Search
                </label>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Search shops or products..."
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
                    <Input
                      placeholder="Enter city or region..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="category">
            <div>
              <label className="mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Product Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="certification">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block">Product Type</label>
                <Controller
                  name="handmade"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Products</SelectItem>
                        <SelectItem value="Yes">Handmade Only</SelectItem>
                        <SelectItem value="Mixed">Mixed Products</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="giCertified"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="giCertified"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="giCertified"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  GI-Certified Shops Only
                </label>
              </div>
            </div>
          </TabsContent>

          <div className="mt-8">
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Find Shops
            </Button>
          </div>
        </div>
      </Tabs>
    </form>
  );
};