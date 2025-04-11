"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";
import {
  Award,
  Book,
  Eye,
  EyeOff,
  Loader,
  MapPin,
  Scroll,
  User,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

const artisanFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number",
      ),
    confirmPassword: z.string(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    experience: z.enum(["APPRENTICE", "CRAFTMAN", "MASTER", "GRANDMASTER"]),
    education: z.enum(["FORMAL", "NON_FORMAL"]),
    training: z.enum(["FORMAL", "NON_FORMAL"]),
    certificate: z.enum(["NONE", "PROFESSIONAL", "TRADE", "WORKSHOP"]),
    recognition: z.enum(["STATE", "NATIONAL", "INTERNATIONAL"]),
    craftId: z.string().min(1, "Craft is required"),
    subCraftId: z.string().min(1, "SubCraft is required"),
    dp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ArtisanFormInput = z.infer<typeof artisanFormSchema>;

const FormSection = ({
  title,
  description,
  children,
  icon,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

export const ArtisanJoinForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const form = useForm<ArtisanFormInput>({
    resolver: zodResolver(artisanFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      address: "",
      description: "",
      experience: "APPRENTICE",
      education: "NON_FORMAL",
      training: "NON_FORMAL",
      certificate: "NONE",
      recognition: "STATE",
      craftId: "",
      subCraftId: "",
      dp: "",
    },
  });

  const [crafts] = api.craft.getAllCrafts.useSuspenseQuery();
  const subcrafts = api.craft.getSubCraftsByCraftId.useQuery(
    { craftId: form.watch("craftId") },
    {
      enabled: !!form.watch("craftId"),
    },
  );

  const createArtisan = api.register.createArtisan.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artisan profile created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ArtisanFormInput) => {
    createArtisan.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      description: data.description,
      experience: data.experience,
      education: data.education,
      training: data.training,
      certificate: data.certificate,
      recognition: data.recognition,
      craftId: data.craftId,
      subCraftId: data.subCraftId,
      email:data.email,
      password:data.password,
      dp: data.dp ?? "/placeholder.png",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Separator className="my-6" />

        <FormSection
          title="Personal Information"
          description="Your basic profile information"
          icon={<User className="h-5 w-5 text-blue-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="w-full" />
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
                    <Input placeholder="Doe" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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

            <FormField
              control={form.control}
              name="dp"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormDescription>
                    Upload a clear photo of yourself
                  </FormDescription>
                  <FormControl>
                    <div className="flex-start mt-2 flex">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) =>
                          field.onChange(res[0]?.appUrl)
                        }
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            title: "Upload Failed",
                            description: error.message,
                          });
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Location & Description"
          description="Tell us about yourself and where you're based"
          icon={<MapPin className="h-5 w-5 text-green-500" />}
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Craft Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>About Your Work</FormLabel>
                <FormDescription>
                  Describe your craft expertise and experience
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your craft journey, specialties, and achievements..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Craft Expertise"
          description="Select your craft category and specialization"
          icon={<Book className="h-5 w-5 text-purple-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="craftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Craft Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select craft category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {crafts.map((craft) => (
                        <SelectItem key={craft.craftId} value={craft.craftId}>
                          {craft.craftName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCraftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        subcrafts.isPending && (
                          <SelectItem value="loading">Loading...</SelectItem>
                        )
                      }
                      {subcrafts.data?.map((subcraft) => (
                        <SelectItem
                          key={subcraft.subCraftId}
                          value={subcraft.subCraftId}
                        >
                          {subcraft.subCraftName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Qualifications"
          description="Your education and certification details"
          icon={<Scroll className="h-5 w-5 text-amber-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FORMAL">Formal</SelectItem>
                      <SelectItem value="NON_FORMAL">Non-Formal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Background</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FORMAL">Formal</SelectItem>
                      <SelectItem value="NON_FORMAL">Non-Formal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certificate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">None</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="TRADE">Trade</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Experience & Recognition"
          description="Your skill level and achievements"
          icon={<Award className="h-5 w-5 text-rose-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APPRENTICE">Apprentice</SelectItem>
                      <SelectItem value="CRAFTMAN">Craftsman</SelectItem>
                      <SelectItem value="MASTER">Master</SelectItem>
                      <SelectItem value="GRANDMASTER">Grandmaster</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recognition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recognition Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recognition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STATE">State</SelectItem>
                      <SelectItem value="NATIONAL">National</SelectItem>
                      <SelectItem value="INTERNATIONAL">
                        International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <Button
          type="submit"
          disabled={createArtisan.isPending}
        >
          {createArtisan.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Complete Registration</span>
            </div>
          )}
        </Button>

        {createArtisan.isPending && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Please wait while we process your registration...
          </p>
        )}
      </form>
    </Form>
  );
};
