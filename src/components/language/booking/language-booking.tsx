"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Loader2, MapPin, Languages, Clock } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useLanguageService } from "~/hooks/use-language";

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  hours: z.number().min(1, "At least 1 hour is required"),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  sourceLanguage: z.string().min(1, "Source language is required"),
  targetLanguage: z.string().min(1, "Target language is required"),
  additionalNotes: z.string().optional(),
});

export type LanguageServiceBookingFormValues = z.infer<typeof bookingFormSchema>;

export const LanguageServiceBookingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { languageService, clearService } = useLanguageService();

  const createBooking = api.language.createBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Language service booked successfully",
      });
      clearService();
      //router.push("/bookings/confirmation");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Language service booking failed",
        variant: "destructive",
      });
    },
  });

  const form = useForm<LanguageServiceBookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hours: languageService.service?.minBookingHours ?? 1,
      bookingDate: "",
      bookingTime: "",
      sourceLanguage: "",
      targetLanguage: "",
      additionalNotes: "",
    },
  });

  if (!languageService.service) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          No Language Service Selected
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please select a language service to continue booking
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/language")}
        >
          Browse Language Services
        </Button>
      </div>
    );
  }

  const service = languageService.service;
  
  const calculateTotal = (hours: number) => {
    return hours * service.hourlyRate;
  };

  const onSubmit = async (data: LanguageServiceBookingFormValues) => {
    const totalAmount = calculateTotal(data.hours);
    
    createBooking.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      hours: data.hours,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      sourceLanguage: data.sourceLanguage,
      targetLanguage: data.targetLanguage,
      additionalNote: data.additionalNotes ?? "",
      languageServiceId: service.languageServiceId,
      totalAmount: totalAmount,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Book Language Service</CardTitle>
            <CardDescription>
              Please fill in your details to book this language service.
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

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bookingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={service.minBookingHours}
                            max={service.maxBookingHours}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sourceLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. English" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Spanish" {...field} />
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
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific requirements or information about your project..."
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

      {/* Service Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Service Summary</CardTitle>
            <CardDescription>Details of your selected service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">{service.firstName} {service.lastName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.description.substring(0, 150)}...
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Languages className="h-4 w-4" />
                  <span>{service.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Working hours: {service.startTime} - {service.endTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">
                  ${service.hourlyRate}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking Date</span>
                <span className="font-medium">
                  {form.watch("bookingDate") ? dayjs(form.watch("bookingDate")).format("DD MMM YYYY") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking Time</span>
                <span className="font-medium">
                  {form.watch("bookingTime") || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of Hours</span>
                <span className="font-medium">
                  {form.watch("hours") || service.minBookingHours}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Price</span>
                <span className="font-semibold">
                  ${service.hourlyRate * (form.watch("hours") || service.minBookingHours)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {form.watch("hours") || service.minBookingHours} hour(s) × ${service.hourlyRate}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              By completing this booking, you agree to our Terms and Conditions
              and Service Guidelines.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};