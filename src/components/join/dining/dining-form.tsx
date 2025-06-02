"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";
import {
  Loader,
  MapPin,
  UtensilsCrossed,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { UploadDropzone } from "~/utils/uploadthing";
import Image from "next/image";

const CUISINE_TYPES = [
  { id: "kashmiri", label: "Kashmiri" },
  { id: "mughlai", label: "Mughlai" },
  { id: "punjabi", label: "Punjabi" },
  { id: "indian", label: "Indian" },
  { id: "chinese", label: "Chinese" },
  { id: "continental", label: "Continental" },
  { id: "middleEastern", label: "Middle Eastern" },
  { id: "italian", label: "Italian" },
  { id: "fusion", label: "Fusion" },
  { id: "organic", label: "Organic & Health Food" },
  { id: "street", label: "Street Food" },
];

const restaurantFormSchema = z
  .object({
    // Account info
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number",
      ),
    confirmPassword: z.string(),

    // Restaurant info
    name: z.string().min(3, "Restaurant name must be at least 3 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    location: z.string().min(5, "Location must be at least 5 characters"),
    cuisine: z.array(z.string()).min(1, "Select at least one cuisine type"),
    priceRange: z.string().min(1, "Price range is required"),
    image: z.string().min(1, "Restaurant image URL is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RestaurantFormInputProps = z.infer<typeof restaurantFormSchema>;

const FormSection = ({
  title,
  description,
  children,
  icon,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="bg-gray-50">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-6">{children}</CardContent>
  </Card>
);

export const DiningRegistrationForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<RestaurantFormInputProps>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      cuisine: [],
      priceRange: "$",
    },
  });

  const createRestaurant = api.register.createRestaurant.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your restaurant has been created successfully.",
      });
      form.reset();
      window.scrollTo(0, 0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RestaurantFormInputProps) => {
    createRestaurant.mutate({
      email: data.email,
      password: data.password,
      name: data.name,
      description: data.description,
      location: data.location,
      cuisine: data.cuisine,
      priceRange: data.priceRange,
      image: data.image,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection
          title="Account Information"
          description="Create your account credentials"
          icon={<User className="h-6 w-6 text-blue-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          value={field.value ?? ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...field}
                          value={field.value ?? ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Restaurant Information"
          description="Basic information about your restaurant"
          icon={<UtensilsCrossed className="h-6 w-6 text-amber-600" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Restaurant Name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="$">$ (Inexpensive)</SelectItem>
                      <SelectItem value="$$">$$ (Moderate)</SelectItem>
                      <SelectItem value="$$$">$$$ (Expensive)</SelectItem>
                      <SelectItem value="$$$$">
                        $$$$ (Very Expensive)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Restaurant Description</FormLabel>
                  <FormDescription>
                    Describe your restaurant, cuisine, ambiance, and what makes
                    it special
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Tell visitors about your dining establishment, specialty dishes, and unique experience..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title="Location & Cuisine"
          description="Where to find your restaurant and what you serve"
          icon={<MapPin className="h-6 w-6 text-red-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full address"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine"
              render={() => (
                <FormItem className="md:col-span-2">
                  <div className="mb-4">
                    <FormLabel>Cuisine Types</FormLabel>
                    <FormDescription>
                      Select all cuisine types that apply to your restaurant
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    {CUISINE_TYPES.map((cuisine) => (
                      <FormField
                        key={cuisine.id}
                        control={form.control}
                        name="cuisine"
                        render={({ field }) => (
                          <FormItem
                            key={cuisine.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cuisine.id)}
                                onCheckedChange={(checked) => {
                                  const updatedCuisines = checked
                                    ? [...field.value, cuisine.id]
                                    : field.value?.filter(
                                        (value) => value !== cuisine.id,
                                      );
                                  field.onChange(updatedCuisines);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {cuisine.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title="Restaurant Image"
          description="Upload a main image for your restaurant"
          icon={<UtensilsCrossed className="h-6 w-6 text-green-600" />}
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Restaurant Image</FormLabel>
                <FormDescription>
                  Upload a high-quality image of your restaurant (exterior,
                  interior, or signature dish)
                </FormDescription>
                <FormControl>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0]?.url);
                    }}
                    onUploadError={(error: Error) => {
                      console.log(error);
                      toast({
                        title: "Error uploading image",
                        description: error.message,
                        variant: "destructive",
                      });
                    }}
                  />
                </FormControl>
                {field.value && (
                  <div className="mt-2">
                    {/* <p className="text-sm text-gray-500">Selected image: {field.value}</p> */}
                    <Image
                      src={field.value}
                      alt="Restaurant Image"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-center space-y-4">
          <Button type="submit" disabled={createRestaurant.isPending}>
            {createRestaurant.isPending ? (
              <div className="flex items-center justify-center gap-3">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Creating Restaurant...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Restaurant</span>
              </div>
            )}
          </Button>

          {createRestaurant.isPending && (
            <p className="text-center text-sm text-gray-500">
              Please wait while we process your restaurant registration...
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
