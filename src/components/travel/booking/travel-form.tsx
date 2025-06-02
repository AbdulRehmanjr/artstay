"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTravel } from "~/hooks/use-travel";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, MapPin, Clock, Globe, Users } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";

export const travelBookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfPeople: z.number()
    .min(1, "At least 1 person is required")
    .max(20, "Maximum 20 people allowed per booking"),
  additionalNotes: z.string().optional(),
});

export type TravelBookingFormValues = z.infer<typeof travelBookingFormSchema>;

export const TravelBookingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { travelPackage, clearPackage } = useTravel();

  const createBooking = api.travelPlanner.createBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Travel tour booked successfully",
      });
      clearPackage();
      router.push("/bookings/confirmation");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Travel booking failed",
        variant: "destructive",
      });
    },
  });

  const form = useForm<TravelBookingFormValues>({
    resolver: zodResolver(travelBookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfPeople: 1,
      additionalNotes: "",
    },
  });

  if (!travelPackage.tour || !travelPackage.startDate) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          No Travel Tour Selected
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please select a travel tour and date to continue booking
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/travel")}
        >
          Browse Travel Tours
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: TravelBookingFormValues) => {
    if (!travelPackage.tour || !travelPackage.startDate) return;
    
    // Calculate total amount based on per person or group pricing
    const totalAmount = travelPackage.tour.isPricePerPerson
      ? travelPackage.tour.price * data.numberOfPeople
      : travelPackage.tour.price;
    
    createBooking.mutate({
      travelPlanerId: travelPackage.tour.travelPlanerId,
      tourId: travelPackage.tour.tourId,
      startDate: travelPackage.startDate,
      endDate: travelPackage.endDate ?? travelPackage.startDate,
      numberOfPeople: data.numberOfPeople,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      additionalRequests: data.additionalNotes ?? "",
      totalAmount: totalAmount,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Book Your Travel Tour</CardTitle>
            <CardDescription>
              Please fill in your details to book the selected travel tour.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
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
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            type="email"
                            {...field}
                          />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="numberOfPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max={travelPackage.tour?.maxGroupSize ?? 20}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements, dietary preferences, or other requests..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Complete Booking"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Tour Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Tour Summary</CardTitle>
            <CardDescription>Details of your selected tour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">{travelPackage.tour.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {travelPackage.tour.description}
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {travelPackage.tour.duration} days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Max Group Size: {travelPackage.tour.maxGroupSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  <span>Languages: {travelPackage.tour.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Starting Point: Based on travel planner&apos;s location</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {dayjs(travelPackage.startDate).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">
                  {dayjs(travelPackage.endDate ?? travelPackage.startDate).format("DD MMM YYYY")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of People</span>
                <span className="font-medium">
                  {form.watch("numberOfPeople") || 1}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Type</span>
                <span className="font-medium">
                  {travelPackage.tour.isPricePerPerson ? "Per Person" : "Group Rate"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Price</span>
                <span className="font-semibold">
                  ${travelPackage.tour.isPricePerPerson 
                    ? (travelPackage.tour.price * (form.watch("numberOfPeople") || 1)).toLocaleString() 
                    : travelPackage.tour.price.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {travelPackage.tour.isPricePerPerson 
                  ? `${form.watch("numberOfPeople") || 1} person(s) × $${travelPackage.tour.price.toLocaleString()}`
                  : `Group rate for up to ${travelPackage.tour.maxGroupSize} people`}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              By completing this booking, you agree to our Terms and Conditions
              and Travel Guidelines.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};