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

const formSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  destination: z.string().min(1, "Destination is required"),
  travelDate: z.string().min(1, "Date is required"),
  passengers: z.number().min(1, "At least one passenger is required"),
  vehicleType: z.string().min(1, "Please select vehicle type"),
});

export const TransitForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup: "",
      destination: "",
      travelDate: "",
      passengers: 1,
      vehicleType: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="z-[100] -mt-16 mx-auto w-full max-w-xl rounded-lg bg-white shadow-lg">
      <div className="rounded-t-lg bg-primary p-4 text-white border-2 border-white">
        <h2 className="text-center text-xl font-bold">
          Book Eco-Friendly Transit
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="– Select Pickup –" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="srinagar">Srinagar Airport</SelectItem>
                      <SelectItem value="downtown">Srinagar Downtown</SelectItem>
                      <SelectItem value="gulmarg">Gulmarg</SelectItem>
                      <SelectItem value="pahalgam">Pahalgam</SelectItem>
                      <SelectItem value="sonamarg">Sonamarg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="– Select Destination –" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="srinagar">Srinagar</SelectItem>
                      <SelectItem value="gulmarg">Gulmarg</SelectItem>
                      <SelectItem value="pahalgam">Pahalgam</SelectItem>
                      <SelectItem value="sonamarg">Sonamarg</SelectItem>
                      <SelectItem value="doodhpathri">Doodhpathri</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="travelDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passengers</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border p-2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
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
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="– Select Vehicle –" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ev-suv">Electric SUV (4 seats)</SelectItem>
                      <SelectItem value="ev-van">Electric Van (8 seats)</SelectItem>
                      <SelectItem value="biofuel-bus">Biofuel Minibus (12 seats)</SelectItem>
                      <SelectItem value="hybrid-car">Hybrid Car (4 seats)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            CHECK AVAILABILITY
          </Button>
        </form>
      </Form>
    </div>
  );
};