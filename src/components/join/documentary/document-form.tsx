"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Eye, EyeOff, Loader2, Plus, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { UploadDropzone } from "~/utils/uploadthing";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dp: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  yearsExperience: z.number().min(0, "Experience must be a positive number"),
  specialization: z
    .array(z.string())
    .min(1, "At least one specialization is required"),
  craftFocusAreas: z
    .array(z.string())
    .min(1, "At least one craft focus area is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

export function CraftDocumentorForm() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dp: "",
      address: "",
      description: "",
      yearsExperience: 0,
      specialization: [],
      craftFocusAreas: [],
      languages: [],
    },
  });

  const createDocumentor = api.documentor.createProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Craft documentor profile created successfully",
      });
      form.reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createDocumentor.mutate({ ...values, dp: values.dp ?? "/placeholder.png" });
  };

  const addItem = (field: keyof z.infer<typeof formSchema>, value: string) => {
    const current = form.getValues(field) as string[];
    if (value.trim() && !current.includes(value.trim())) {
      form.setValue(field, [...current, value.trim()]);
    }
  };

  const removeItem = (
    field: keyof z.infer<typeof formSchema>,
    item: string,
  ) => {
    const current = form.getValues(field) as string[];
    form.setValue(
      field,
      current.filter((i) => i !== item),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Information</h3>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                      value={field.value ?? ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself and your craft documentation experience"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                {field.value ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={field.value}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                    <Button
                      title="btn"
                      variant="outline"
                      type="button"
                      onClick={() => field.onChange("")}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      setIsUploading(false);
                      if (res?.[0]?.url) {
                        field.onChange(res[0].url);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploading(false);
                      toast({
                        title: "Upload Error",
                        description: error.message,
                        variant: "destructive",
                      });
                    }}
                    onUploadBegin={() => {
                      setIsUploading(true);
                    }}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Specialization */}
        <FormField
          control={form.control}
          name="specialization"
          render={() => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.watch("specialization").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"
                  >
                    {item}
                    <button
                      title="btn"
                      type="button"
                      onClick={() => removeItem("specialization", item)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add specialization"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addItem("specialization", input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  title="btn"
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousSibling as HTMLInputElement;
                    addItem("specialization", input.value);
                    input.value = "";
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Craft Focus Areas */}
        <FormField
          control={form.control}
          name="craftFocusAreas"
          render={() => (
            <FormItem>
              <FormLabel>Craft Focus Areas</FormLabel>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.watch("craftFocusAreas").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"
                  >
                    {item}
                    <button
                      title="btn"
                      type="button"
                      onClick={() => removeItem("craftFocusAreas", item)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add craft focus area"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addItem("craftFocusAreas", input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  title="btn"
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousSibling as HTMLInputElement;
                    addItem("craftFocusAreas", input.value);
                    input.value = "";
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Languages */}
        <FormField
          control={form.control}
          name="languages"
          render={() => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.watch("languages").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"
                  >
                    {item}
                    <button
                      title="btn"
                      type="button"
                      onClick={() => removeItem("languages", item)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add language"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addItem("languages", input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  title="btn"
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousSibling as HTMLInputElement;
                    addItem("languages", input.value);
                    input.value = "";
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          title="btn"
          type="submit"
          disabled={createDocumentor.isPending || isUploading}
          className="w-full"
        >
          {createDocumentor.isPending || isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Craft Documentor Profile
        </Button>
      </form>
    </Form>
  );
}
