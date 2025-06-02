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
  carft: z.string().min(1, "Please select a craft"),
  location: z.string().min(1, "Please enter a location"),
  rating: z.string().min(1, "Please select a craft"),
});

export const BusinessForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carft: "",
      location: "",
      rating: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="z-[100] -mt-16 mx-auto w-full max-w-xl rounded-lg bg-white shadow-lg">
      <div className="rounded-t-lg bg-primary p-4 text-white border-2 border-white">
        <h2 className="text-center text-xl font-bold">
          Find A Craft Business/Shop
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <FormField
            control={form.control}
            name="carft"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                  Select Craft/Product*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="– Select Craft/Product –" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fair">Craft Fairs</SelectItem>
                    <SelectItem value="exhibition">
                      Craft Exhibitions
                    </SelectItem>
                    <SelectItem value="museum">Craft Museums</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                  Enter your location*
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carft"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">
                  Select Craft/Product*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="– Select Craft/Product –" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Star</SelectItem>
                    <SelectItem value="3">3 Star</SelectItem>
                    <SelectItem value="4">4 Star</SelectItem>
                    <SelectItem value="5">5 Star</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            FIND NOW
          </Button>
        </form>
      </Form>
    </div>
  );
};
