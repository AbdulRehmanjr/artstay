"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useOrderStore, calculateOrderTotal } from "~/hooks/use-dining";

export const diningBookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  additionalNotes: z.string().optional(),
});

export type DiningBookingFormValues = z.infer<typeof diningBookingFormSchema>;

export const RestaurantBookingForm = () => {
  const { toast } = useToast();
  const { items, clearOrder, restaurantId } = useOrderStore();

  // Calculate total
  const subtotal = calculateOrderTotal(items);
  const taxRate = 0.05; // 5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const createBooking = api.dining.createRestaurantBooking.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your order has been placed successfully",
      });
      clearOrder();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place your order",
        variant: "destructive",
      });
    },
  });

  const form = useForm<DiningBookingFormValues>({
    resolver: zodResolver(diningBookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: DiningBookingFormValues) => {
    
    const orderItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    }));

    createBooking.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      resturantId: restaurantId ?? "",
      additionalNote: data.additionalNotes ?? "",
      items: orderItems,
      subtotal,
      tax,
      total,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Order</CardTitle>
        <CardDescription>
          Please provide your details to complete your restaurant order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or dietary requirements..."
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
                "Place Order"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
