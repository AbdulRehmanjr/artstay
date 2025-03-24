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
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";
import {
  Eye,
  EyeOff,
  Loader,
  MapPin,
  User,
  Globe,
  DollarSign,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";

// Type definition for Travel Planner
export type TravelPlanerCreationProps = {
  name: string;
  description: string;
  location: string;
  priceRange: string;
  language: string[];
  speciality: string[];
  email: string;
  password: string;
  dp: string;
};

const travelPlannerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number",
      ),
    confirmPassword: z.string(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    priceRange: z.string().min(1, "Please select a price range"),
    language: z.array(z.string()).min(1, "Select at least one language"),
    speciality: z.array(z.string()).min(1, "Select at least one speciality"),
    dp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type TravelPlannerInputProps = z.infer<typeof travelPlannerFormSchema>;

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
  <div className="space-y-6">
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

// Language options
const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "arabic", label: "Arabic" },
  { id: "mandarin", label: "Mandarin" },
  { id: "russian", label: "Russian" },
  { id: "japanese", label: "Japanese" },
  { id: "hindi", label: "Hindi" },
];

// Speciality options
const specialityOptions = [
  { id: "wildlife", label: "Wildlife Safari" },
  { id: "cultural", label: "Cultural Tours" },
  { id: "adventure", label: "Adventure Travel" },
  { id: "luxury", label: "Luxury Travel" },
  { id: "budget", label: "Budget Travel" },
  { id: "eco", label: "Eco-Tourism" },
  { id: "historical", label: "Historical Sites" },
  { id: "culinary", label: "Culinary Experiences" },
  { id: "family", label: "Family Trips" },
];

export const TravelerForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<TravelPlannerInputProps>({
    resolver: zodResolver(travelPlannerFormSchema),
    defaultValues: {
      language: [],
      speciality: [],
    },
  });

  const createTravelPlanner = api.register.createTravelPlaner.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Travel planner profile created successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: TravelPlannerInputProps) => {
    createTravelPlanner.mutate({
      name: data.name,
      description: data.description,
      location: data.location,
      priceRange: data.priceRange,
      language: data.language,
      speciality: data.speciality,
      email: data.email,
      password: data.password,
      dp: data.dp ?? '/placeholder.png',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Separator className="my-6" />

        <FormSection
          title="Personal Information"
          description="Your basic profile information"
          icon={<User className="h-5 w-5 text-blue-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Adventure Travels" {...field} value={field.value ?? ''} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {...field} value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                        {...field} value={field.value ?? ''}
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
                        {...field} value={field.value ?? ''}
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

            <FormField
              control={form.control}
              name="dp"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormDescription>
                    Upload a logo or profile image
                  </FormDescription>
                  <FormControl>
                    <div className="flex-start mt-2 flex">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) =>
                          field.onChange(res[0]?.appUrl)
                        }
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            title: "Upload Failed",
                            description: error.message,
                          });
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Location & Description"
          description="Tell travelers about your services and base location"
          icon={<MapPin className="h-5 w-5 text-green-500" />}
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Serengeti, Tanzania" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>About Your Services</FormLabel>
                <FormDescription>
                  Describe your travel expertise and unique offerings
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your travel services, expertise, and what makes your experiences unique..."
                    className="min-h-[120px]"
                    {...field} value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Pricing & Specialization"
          description="Your services details and pricing structure"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        >
          <FormField
            control={form.control}
            name="priceRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range</FormLabel>
                <FormDescription>Select the typical price range for your services</FormDescription>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a price range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="budget">Budget ($)</SelectItem>
                      <SelectItem value="moderate">Moderate ($$)</SelectItem>
                      <SelectItem value="premium">Premium ($$$)</SelectItem>
                      <SelectItem value="luxury">Luxury ($$$$)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Languages & Specialties"
          description="Languages offered and travel specialties"
          icon={<Globe className="h-5 w-5 text-purple-500" />}
        >
          <FormField
            control={form.control}
            name="language"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Languages</FormLabel>
                  <FormDescription>
                    Select the languages in which you can provide services
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {languageOptions.map((language) => (
                    <FormField
                      key={language.id}
                      control={form.control}
                      name="language"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={language.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(language.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, language.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((value) => value !== language.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {language.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speciality"
            render={() => (
              <FormItem className="mt-6">
                <div className="mb-4">
                  <FormLabel>Specialties</FormLabel>
                  <FormDescription>
                    Select your travel planning specialties
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {specialityOptions.map((specialty) => (
                    <FormField
                      key={specialty.id}
                      control={form.control}
                      name="speciality"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={specialty.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(specialty.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, specialty.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((value) => value !== specialty.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {specialty.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <Button
          type="submit"
          className="w-full"
          disabled={createTravelPlanner.isPending}
        >
          {createTravelPlanner.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Register</span>
            </div>
          )}
        </Button>

        {createTravelPlanner.isPending && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Please wait while we process your registration...
          </p>
        )}
      </form>
    </Form>
  );
};