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
  tripType: z.string().min(1, "Please select trip type"),
  travelDates: z.string().min(1, "Please select dates"),
  travelers: z.number().min(1, "At least one traveler is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

export const PlannerForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: "",
      travelDates: "",
      travelers: 2,
      interests: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  const interestOptions = [
    "Cultural Crafts",
    "Eco Retreats",
    "Culinary",
    "Adventure",
    "Spiritual",
    "Photography",
    "Wildlife",
    "Houseboats"
  ];

  return (
    <div className="z-[100] -mt-16 mx-auto w-full max-w-md rounded-lg bg-white shadow-lg">
      <div className="rounded-t-lg bg-primary p-4 text-white border-2 border-white">
        <h2 className="text-center text-xl font-bold">
          Plan Your Kashmir Trip
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Trip Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Travelers</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="travelDates"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Travel Dates</FormLabel>
                <FormControl>
                  <Input type="date" className="h-10" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Interests</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={interest}
                          value={interest}
                          checked={field.value?.includes(interest)}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              e.target.checked
                                ? [...(field.value || []), value]
                                : field.value?.filter((v) => v !== value)
                            );
                          }}
                          className="h-4 w-4"
                        />
                        <label htmlFor={interest} className="text-sm">
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2 h-10">
            Get Itinerary
          </Button>
        </form>
      </Form>
    </div>
  );
};