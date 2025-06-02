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
  serviceType: z.string().min(1, "Please select service type"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  date: z.string().min(1, "Date is required"),
  duration: z.string().min(1, "Please select duration"),
  contactMethod: z.string().min(1, "Please select contact method"),
});

export const LanguageForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      languages: [],
      date: "",
      duration: "",
      contactMethod: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  const languageOptions = [
    "Kashmiri",
    "Urdu",
    "Hindi",
    "English",
    "Arabic",
    "Spanish",
    "French",
    "German"
  ];

  return (
    <div className="z-[100] -mt-16 mx-auto w-full max-w-md rounded-lg bg-white shadow-lg">
      <div className="rounded-t-lg bg-primary p-4 text-white border-2 border-white">
        <h2 className="text-center text-xl font-bold">
          Language Services
        </h2>
        <p className="text-center text-sm opacity-80 mt-1">
          Connect seamlessly during your Kashmir visit
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Service Needed</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="guide">Tour Guide Interpretation</SelectItem>
                    <SelectItem value="document">Document Translation</SelectItem>
                    <SelectItem value="medical">Medical Interpretation</SelectItem>
                    <SelectItem value="business">Business Meetings</SelectItem>
                    <SelectItem value="emergency">Emergency Assistance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Language Pair</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {languageOptions.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={language}
                          value={language}
                          checked={field.value?.includes(language)}
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
                        <label htmlFor={language} className="text-sm">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Date Needed</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-10" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Duration</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="2h">2 Hours</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="fullday">Full Day</SelectItem>
                      <SelectItem value="multiday">Multiple Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Contact Method</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Preferred contact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="inperson">In-Person Meeting</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2 h-10">
            Request Language Service
          </Button>
        </form>
      </Form>
    </div>
  );
};