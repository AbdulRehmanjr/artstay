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
  Eye,
  EyeOff,
  Loader,
  MapPin,
  User,
  Clock,
  Calendar,
  Store,
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
import { FileUpload } from "~/components/common/image-uploader";

const shopFormSchema = z
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

    // Shop info
    shopName: z.string().min(3, "Shop name must be at least 3 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    // Shop timing
    openingTime: z.string().min(1, "Required"),
    openingPeriod: z.enum(["AM", "PM"]),
    closingTime: z.string().min(1, "Required"),
    closingPeriod: z.enum(["AM", "PM"]),

    // Working days
    workingDays: z.array(z.string()).min(1, "Select at least one working day"),

    // Display picture
    dp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ShopFormInputProps = z.infer<typeof shopFormSchema>;

// Days of the week with their three-letter abbreviations
const daysOfWeek = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

// Time options for dropdown
const timeOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

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

export const ShopCreationForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<ShopFormInputProps>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      workingDays: [],
      openingPeriod: "AM",
      closingPeriod: "PM",
    },
  });

  const createShop = api.register.createShop.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Shop created successfully.",
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

  const onSubmit = async (data: ShopFormInputProps) => {
    // Format shop timing as "10 AM - 11 PM"
    const shopTiming = `${data.openingTime} ${data.openingPeriod} - ${data.closingTime} ${data.closingPeriod}`;

    createShop.mutate({
      email: data.email,
      password: data.password,
      shopName: data.shopName,
      address: data.address,
      description: data.description,
      shopTiming: shopTiming,
      workingDays: data.workingDays,
      dp: data.dp ?? "/placeholder.png",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection
          title="Account Information"
          description="Create your account credentials"
          icon={<User className="h-5 w-5 text-blue-500" />}
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

        <Separator className="my-6" />

        <FormSection
          title="Shop Details"
          description="Basic information about your shop"
          icon={<Store className="h-5 w-5 text-green-500" />}
        >
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My Amazing Shop"
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
            name="dp"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Shop Display Picture</FormLabel>
                <FormControl>
                  <FileUpload
                    onFileUpload={(fileUrl) => field.onChange(fileUrl)}
                    value={field.value}
                    accept="image/*"
                    maxSizeMB={2}
                    label="Shop Logo"
                    description="Upload your shop logo or banner image"
                    showPreview={true}
                    previewType="image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Location & Description"
          description="Tell us about your shop and where it's located"
          icon={<MapPin className="h-5 w-5 text-purple-500" />}
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Shop Street, City, Country"
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
            name="description"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Shop Description</FormLabel>
                <FormDescription>
                  Describe what your shop offers and any special features
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Tell potential customers about your products, services, and what makes your shop unique..."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Shop Hours"
          description="When your shop is open for business"
          icon={<Clock className="h-5 w-5 text-orange-500" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 font-medium">Opening Time</p>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openingPeriod"
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium">Closing Time</p>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="closingTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closingPeriod"
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Working Days"
          description="Select which days your shop is open"
          icon={<Calendar className="h-5 w-5 text-red-500" />}
        >
          <FormField
            control={form.control}
            name="workingDays"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {daysOfWeek.map((day) => (
                    <FormField
                      key={day.value}
                      control={form.control}
                      name="workingDays"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={day.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        day.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== day.value,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {day.label}
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
          disabled={createShop.isPending}
        >
          {createShop.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Create Shop</span>
            </div>
          )}
        </Button>

        {createShop.isPending && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Please wait while we process your shop registration...
          </p>
        )}
      </form>
    </Form>
  );
};
