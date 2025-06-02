"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSafari } from "~/hooks/use-safari";
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
import { Loader2, Clock, Building } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfGuests: z.number().min(1, "At least 1 guest is required"),
  additionalNotes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const SafariBookingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { safariPackage, clearPackage } = useSafari();

  const createBooking = api.safari.createSafariBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Safari booking created successfully",
      });
      clearPackage();
    //   router.push("/bookings/confirmation");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Safari booking creation error",
        variant: "destructive",
      });
    },
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfGuests: 1,
      additionalNotes: "",
    },
  });

  if (!safariPackage.tour) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          No Safari Tour Selected
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please select a safari tour to continue booking
        </p>
        <Button className="mt-4" onClick={() => router.push("/tours/safari")}>
          Browse Safari Tours
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: BookingFormValues) => {
    createBooking.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      numberOfGuests: data.numberOfGuests,
      additionalNote: data.additionalNotes ?? "none",
      tourDate: safariPackage.date,
      tourId: safariPackage.id,
      totalAmount: (safariPackage.tour?.fee ?? 0) * data.numberOfGuests,
      safariId: safariPackage.tour?.safariId ?? "none",
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Safari Booking</CardTitle>
            <CardDescription>
              Please fill in your details to book your safari experience.
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
                  name="numberOfGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
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
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests, dietary requirements, or notes for your safari..."
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

      {/* Booking Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Safari Summary</CardTitle>
            <CardDescription>Details of your selected safari</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg">
              <h3 className="font-medium">{safariPackage.tour.title}</h3>{" "}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4" />
                  <span>{safariPackage.tour.operator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{safariPackage.tour.duration}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Tour Date</p>
                <p className="font-medium">
                  {dayjs(safariPackage.date).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {safariPackage.tour.duration}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per person</span>
                <span className="font-medium">${safariPackage.tour.fee}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Price</span>
                <span className="font-semibold">
                  $
                  {(
                    safariPackage.tour.fee * (form.watch("numberOfGuests") || 1)
                  ).toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {form.watch("numberOfGuests") || 1} guest(s) × $
                {safariPackage.tour.fee}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              By completing this booking, you agree to our Terms and Conditions
              and Safari Safety Guidelines.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
