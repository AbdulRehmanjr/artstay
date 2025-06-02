"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFairEvent } from "~/hooks/use-fair";
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
import { Loader2, MapPin, Building, Award } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfTickets: z.number().min(1, "At least 1 ticket is required"),
  ticketType: z.enum(["general", "vip", "student"]),
  additionalNotes: z.string().optional(),
});

export type FairBookingFormValues = z.infer<typeof bookingFormSchema>;

export const FairBookingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { fairEvent, clearEvent } = useFairEvent();

  const createBooking = api.fair.createFairBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Fair tickets booked successfully",
      });
      clearEvent();
      router.push("/bookings/confirmation");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Fair booking failed",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FairBookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfTickets: 1,
      ticketType: "general",
      additionalNotes: "",
    },
  });

  if (!fairEvent.event || !fairEvent.date) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          No Fair Event Selected
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please select a fair event and date to continue booking
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/fairs")}
        >
          Browse Fair Events
        </Button>
      </div>
    );
  }

  const ticketPrices = {
    general: 20,
    vip: 50,
    student: 10
  };

  const onSubmit = async (data: FairBookingFormValues) => {
    const ticketPrice = ticketPrices[data.ticketType];
    const totalAmount = ticketPrice * data.numberOfTickets;
    
    createBooking.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      numberOfTickets: data.numberOfTickets,
      ticketType: data.ticketType,
      additionalNote: data.additionalNotes ?? "",
      eventDate: fairEvent.date,
      eventId: fairEvent.event?.eventId ??'',
      fairId: fairEvent.event?.fairId ?? '',
      totalAmount: totalAmount,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Book Your Fair Tickets</CardTitle>
            <CardDescription>
              Please fill in your details to book tickets for the fair event.
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

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="general">General Admission ($20)</option>
                            <option value="vip">VIP ($50)</option>
                            <option value="student">Student ($10)</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfTickets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Tickets</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
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
                          placeholder="Any special requirements or requests..."
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

      {/* Event Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Fair Event Summary</CardTitle>
            <CardDescription>Details of your selected event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">{fairEvent.event.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {fairEvent.event.description}
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  <span>{fairEvent.event.fairType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{fairEvent.event.vanue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4" />
                  <span>{fairEvent.event.organizer}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Visit Date</p>
                <p className="font-medium">
                  {dayjs(fairEvent.date).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Event Period</span>
                <span className="font-medium">
                  {dayjs(fairEvent.event.startDate).format("DD MMM")} - {dayjs(fairEvent.event.endDate).format("DD MMM YYYY")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ticket Type</span>
                <span className="font-medium">
                  {form.watch("ticketType") === "vip" ? "VIP" : 
                   form.watch("ticketType") === "student" ? "Student" : "General Admission"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of Tickets</span>
                <span className="font-medium">
                  {form.watch("numberOfTickets") || 1}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Price</span>
                <span className="font-semibold">
                  ${ticketPrices[form.watch("ticketType")] * (form.watch("numberOfTickets") || 1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {form.watch("numberOfTickets") || 1} ticket(s) × ${ticketPrices[form.watch("ticketType")]}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              By completing this booking, you agree to our Terms and Conditions
              and Event Guidelines.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};