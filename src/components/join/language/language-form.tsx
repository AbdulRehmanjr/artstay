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
  Languages,
  GraduationCap,
  Building,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

const languageServiceFormSchema = z
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
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
    education: z.enum(["HIGH_SCHOOL", "BACHELORS", "MASTERS", "PHD", "OTHER"]),
    specialization: z.enum(["TOUR_GUIDE", "INTERPRETER", "TRANSLATOR", "CULTURAL_EXPERT"]),
    languages: z.array(z.string()).min(2, "Please select at least 2 languages"),
    certifications: z.string().optional(),
    availability: z.enum(["FULL_TIME", "PART_TIME", "ON_DEMAND", "SEASONAL"]),
    dp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LanguageServiceFormInput = z.infer<typeof languageServiceFormSchema>;

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

export const LanguageServiceJoinForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  
  const form = useForm<LanguageServiceFormInput>({
    resolver: zodResolver(languageServiceFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      description: "",
      experience: "BEGINNER",
      education: "BACHELORS",
      specialization: "TRANSLATOR",
      languages: [],
      certifications: "",
      availability: "FULL_TIME",
      dp: "",
    },
  });

  const createLanguageService = api.register.createLanguageService.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Language service profile created successfully",
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

  const onSubmit = async (data: LanguageServiceFormInput) => {
    createLanguageService.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      address: data.address,
      phone: data.phone,
      description: data.description,
      experience: data.experience,
      education: data.education,
      specialization: data.specialization,
      languages: data.languages,
      certifications: data.certifications,
      availability: data.availability,
      dp: data.dp ?? "/placeholder.png",
    });
  };

  const availableLanguages = [
    "English",
    "Kashmiri",
    "Hindi",
    "Urdu",
    "Arabic",
    "French",
    "German",
    "Spanish",
    "Chinese",
    "Japanese",
    "Russian",
    "Italian",
  ];

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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
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
                    Upload a professional photo
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
                  <Input placeholder="123 Language Street, Srinagar" {...field} />
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
                <FormLabel>About Your Services</FormLabel>
                <FormDescription>
                  Describe your language expertise and cultural knowledge
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience with languages, cultural expertise, and how you can help bridge communication gaps..."
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
          title="Language Expertise"
          description="Select your languages and specialization"
          icon={<Languages className="h-5 w-5 text-purple-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormDescription>
                    Select all languages you're proficient in
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {availableLanguages.map((lang) => (
                        <label
                          key={lang}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            value={lang}
                            checked={field.value.includes(lang)}
                            onChange={(e) => {
                              const updatedLanguages = e.target.checked
                                ? [...field.value, lang]
                                : field.value.filter((l) => l !== lang);
                              field.onChange(updatedLanguages);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span>{lang}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
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
                      <SelectItem value="TOUR_GUIDE">Tour Guide</SelectItem>
                      <SelectItem value="INTERPRETER">Interpreter</SelectItem>
                      <SelectItem value="TRANSLATOR">Translator</SelectItem>
                      <SelectItem value="CULTURAL_EXPERT">Cultural Expert</SelectItem>
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
          icon={<GraduationCap className="h-5 w-5 text-amber-500" />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
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
                      <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                      <SelectItem value="BACHELORS">Bachelor's Degree</SelectItem>
                      <SelectItem value="MASTERS">Master's Degree</SelectItem>
                      <SelectItem value="PHD">PhD</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <FormDescription>
                    List any language or tourism certifications
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="TOEFL, Tourism Certificate, Cultural Ambassador..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Experience & Availability"
          description="Your skill level and work availability"
          icon={<Building className="h-5 w-5 text-rose-500" />}
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
                      <SelectItem value="BEGINNER">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="ADVANCED">Advanced (5-10 years)</SelectItem>
                      <SelectItem value="EXPERT">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="ON_DEMAND">On Demand</SelectItem>
                      <SelectItem value="SEASONAL">Seasonal</SelectItem>
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
          disabled={createLanguageService.isPending}
          className="w-full md:w-auto"
        >
          {createLanguageService.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Complete Registration</span>
            </div>
          )}
        </Button>

        {createLanguageService.isPending && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Please wait while we process your registration...
          </p>
        )}
      </form>
    </Form>
  );
};