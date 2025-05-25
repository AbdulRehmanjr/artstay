"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";
import {
  Eye,
  EyeOff,
  Loader,
  User,
  Building,
  MapPin,
  Clock,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import React from "react";
import { Textarea } from "~/components/ui/textarea";

const formSchemas = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
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
    hotelName: z.string().min(3, "Hotel name must be at least 3 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    checkIn: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter time in HH:MM format",
      )
      .default("14:00"),
    checkOut: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter time in HH:MM format",
      )
      .default("11:00"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type HotelServiceFormInput = z.infer<typeof formSchemas>;

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

export const HotelServiceForm = () => {
  const { toast } = useToast();

  const form = useForm<HotelServiceFormInput>({
    resolver: zodResolver(formSchemas),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      hotelName: "",
      address: "",
      description: "",
      phone: "",
      longitude: "",
      latitude: "",
      checkIn: "14:00",
      checkOut: "11:00",
    },
  });

  const createHotel = api.register.createHotelService.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel registration completed successfully",
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

  const onSubmit = async (data: HotelServiceFormInput) => {
    createHotel.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Separator className="my-6" />

        <FormSection
          title="Account Information"
          description="Create your login credentials"
          icon={<User className="h-5 w-5 text-blue-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                    <PasswordInput {...field} />
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
                    <PasswordInput {...field} placeholder="Confirm password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Personal Information"
          description="Your basic profile information"
          icon={<User className="h-5 w-5 text-purple-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Hotel Information"
          description="Details about your hotel property"
          icon={<Building className="h-5 w-5 text-green-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="hotelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grand Palace Hotel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main Street, City, Country"
                      {...field}
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
                <FormItem className="lg:col-span-2">
                  <FormLabel>Hotel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your hotel, amenities, and what makes it special..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Location Coordinates"
          description="GPS coordinates for your hotel (optional but recommended)"
          icon={<MapPin className="h-5 w-5 text-red-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="40.7128 (e.g., New York City)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="-74.0060 (e.g., New York City)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Check-in/Check-out Times"
          description="Set your hotel's standard check-in and check-out times"
          icon={<Clock className="h-5 w-5 text-orange-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Button
          type="submit"
          disabled={createHotel.isPending}
          className="w-full md:w-auto"
        >
          {createHotel.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            "Complete Hotel Registration"
          )}
        </Button>

        {createHotel.isPending && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Please wait while we process your hotel registration...
          </p>
        )}
      </form>
    </Form>
  );
};

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter password",
  ...props
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
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
  );
};
