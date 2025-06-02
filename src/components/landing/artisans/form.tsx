"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the validation schema
const formSchema = z
  .object({
    craft: z
      .string({
        required_error: "Please select a craft",
      })
      .min(1, "Please select a craft"),

    subCraft: z
      .string({
        required_error: "Please select a sub craft",
      })
      .min(1, "Please select a sub craft"),

    checkIn: z
      .string({
        required_error: "Check-in date is required",
      })
      .refine((date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) >= today;
      }, "Check-in date must be today or later"),

    checkOut: z
      .string({
        required_error: "Check-out date is required",
      })
      .refine((date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) >= today;
      }, "Check-out date must be today or later"),
  })
  .refine(
    (data) => {
      return new Date(data.checkOut) > new Date(data.checkIn);
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOut"],
    },
  );

export const ArtisanForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      craft: "",
      subCraft: "",
      checkIn: "",
      checkOut: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="z-[100] -mt-16 col-span-2 lg:col-span-1 flex max-w-lg flex-col gap-3 rounded-lg bg-white shadow-xl">
      <div className="rounded-t-lg bg-primary p-3 border-white border-2">
        <h2 className="text-center font-heading text-xl font-bold text-white">
          Find an Artisan: Tailored To Your Needs
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full  space-y-6 p-3"
        >
          <FormField
            control={form.control}
            name="craft"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                  Select the craft you&apos;re interested in*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Boutique Craft" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="boutique">Boutique Craft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCraft"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                  Select the sub craft you&apos;re interested in*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="– Select Sub Craft –" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sub1">Sub Craft 1</SelectItem>
                    <SelectItem value="sub2">Sub Craft 2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Check In</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-600">Check Out</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">FIND ARTISAN</Button>
        </form>
      </Form>
    </div>
  );
};
