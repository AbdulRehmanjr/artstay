"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { usePackage } from "~/hooks/use-artisan";
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
import { Clock, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import {  useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  additionalNotes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const ArtisanBookingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { artisanPackage, setClearPackage } = usePackage();

  const createBooking = api.artisan.createArtisanBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking created succesfully",
      });
      setClearPackage();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Booking creation error",
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
      additionalNotes: "",
    },
  });

  if (!artisanPackage.title) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          No Package Selected
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please select a package to continue booking
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/artisans/packages")}
        >
          Browse Packages
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
      additionalNote: data.additionalNotes ?? "none",
      startDate: artisanPackage.startDate,
      endDate: artisanPackage.endDate,
      packageId: artisanPackage.id,
      amount: artisanPackage.amount,
      artisanId:artisanPackage.artisanId,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
            <CardDescription>
              Please fill in your details to book your artisan experience.
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
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or notes for your booking..."
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
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Details of your selected package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">{artisanPackage.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{artisanPackage.duration} Days</span>
                </div>
                <span className="font-semibold">${artisanPackage.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {dayjs(artisanPackage.startDate).format("DD.MM.YYYY")}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">
                  {dayjs(artisanPackage.endDate).format("DD.MM.YYYY")}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Price</span>
                <span className="font-semibold">${artisanPackage.amount}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              By completing this booking, you agree to our Terms and Conditions
              and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
