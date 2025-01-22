'use client'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const destinations = [
  {
    id: "khanqah",
    label: "Khanqah & Zadibal",
    description: "woodwork, papier-mache sozn embroidery"
  },
  {
    id: "safakadal",
    label: "Safakadal & Eidgah",
    description: "chain-stitch embroidery, pashmina weavers, woodcarvers. aari embroidery."
  },
  {
    id: "raniwari",
    label: "Raniwari, Kathi Darwaza, & Aali Kadal",
    description: "Pottery, Walnut Woodcarvings, Pashmina dyeing."
  },
  {
    id: "nallah",
    label: "Nallah Mar & Amda Kadal",
    description: "Zari Embroidery and Namdhakari, Copperware and Silverware."
  }
];

const formSchema = z.object({
  destinations: z.array(z.string()).min(1, "Please select at least one destination"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.number().min(1, "At least one adult is required"),
  children: z.number().min(0).optional()
}).refine(data => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

export const SafariForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinations: [],
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0
    }
  });

  const onSubmit = (data : z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="bg-primary text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-center">Find A Craft Safari Cluster</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <FormLabel className="block text-gray-600 mb-3">
              Select One or More Safari Destinations.*
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinations.map((destination) => (
                <div key={destination.id} className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id={destination.id}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("destinations");
                        if (checked) {
                          form.setValue("destinations", [...current, destination.id]);
                        } else {
                          form.setValue("destinations", current.filter(id => id !== destination.id));
                        }
                      }}
                    />
                    <label htmlFor={destination.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {destination.label}
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">{destination.description}</p>
                </div>
              ))}
            </div>
          </div>

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
                      className="w-full p-2 border rounded-md"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
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
                      className="w-full p-2 border rounded-md"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    >
                      {[0,1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#8B4513] hover:bg-[#704019] text-white py-2 rounded"
          >
            FIND NOW
          </Button>
        </form>
      </Form>
    </div>
  );
};

