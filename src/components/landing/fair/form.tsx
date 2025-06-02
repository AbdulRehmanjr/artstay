"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z
  .object({
    craftEvent: z.string().min(1, "Please select a craft event"),
    craftFair: z.string().min(1, "Please select a craft fair"),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    adults: z.number().min(1, "At least one adult is required"),
    children: z.number().min(0).optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export const FairForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      craftEvent: "",
      craftFair: "",
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="z-[100] -mt-16 mx-auto w-full max-w-xl rounded-lg bg-white shadow-lg">
      <div className="rounded-t-lg bg-primary p-4 text-white border-2 border-white">
        <h2 className="text-center text-xl font-bold">
          Find A Craft Fairs/Exhibition/Museum
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check In</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
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
                  <FormLabel>Check Out</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adult</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border p-2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Children</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border p-2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="craftEvent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                Select Craft Event*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="– Select Fair Category –" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fair">Craft Fairs</SelectItem>
                    <SelectItem value="exhibition">Craft Exhibitions</SelectItem>
                    <SelectItem value="museum">Craft Museums</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="craftFair"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                Select Ongoing Craft Fair*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="– Select Ongoing Craft –" />
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

          <Button type="submit" className="w-full">FIND NOW</Button>
        </form>
      </Form>
    </div>
  );
};
