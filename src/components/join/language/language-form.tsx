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
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";
import {
  Eye,
  EyeOff,
  Loader,
  User,
  Languages,
  Calendar,
  Briefcase,
  Monitor,
  Award,
  Plus,
  X,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import React from "react";

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
    profileName: z
      .string()
      .min(3, "Profile name must be at least 3 characters"),
    location: z.string().min(5, "Location must be at least 5 characters"),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters"),
    experience: z.string().min(10, "Experience must be at least 10 characters"),
    qualification: z
      .string()
      .min(5, "Qualification must be at least 5 characters"),
    languages: z.array(z.string()).min(1, "Please select at least 1 language"),
    specialization: z
      .array(z.string())
      .min(1, "Please select at least 1 specialization"),
    serviceMode: z
      .array(z.string())
      .min(1, "Please select at least 1 service mode"),
    certification: z.array(z.string()).optional(),
    availability: z
      .array(z.string())
      .min(1, "Please select your available days"),
    hourlyRate: z.number().min(1, "Hourly rate must be at least $1"),
    minBookingHours: z
      .number()
      .min(1, "Minimum booking must be at least 1 hour"),
    maxBookingHours: z
      .number()
      .min(1, "Maximum booking must be at least 1 hour"),
    startTime: z.string(),
    endTime: z.string(),
    profileImage: z.string().optional(),
    portfolio: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.maxBookingHours >= data.minBookingHours, {
    message: "Maximum hours must be greater than or equal to minimum hours",
    path: ["maxBookingHours"],
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
  "Punjabi",
  "Bengali",
];

const specializationOptions = [
  "Translation",
  "Interpretation",
  "Transcription",
  "Localization",
  "Language Teaching",
  "Document Translation",
  "Legal Translation",
  "Medical Translation",
  "Technical Translation",
  "Tourism Guide",
  "Cultural Consultation",
];

const serviceModeOptions = [
  "Online",
  "In-Person",
  "Hybrid",
  "Phone",
  "Video Call",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const LanguageServiceForm = () => {
  const { toast } = useToast();
  const [certifications, setCertifications] = React.useState<string[]>([]);
  const [currentCertification, setCurrentCertification] = React.useState("");
  const [portfolioImages, setPortfolioImages] = React.useState<string[]>([]);

  const form = useForm<LanguageServiceFormInput>({
    resolver: zodResolver(languageServiceFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      profileName: "",
      location: "",
      description: "",
      experience: "",
      qualification: "",
      languages: [],
      specialization: [],
      serviceMode: [],
      certification: [],
      availability: [],
      hourlyRate: 0,
      minBookingHours: 1,
      maxBookingHours: 8,
      startTime: "09:00",
      endTime: "18:00",
      profileImage: "",
      portfolio: [],
    },
  });

  const createLanguageService = api.register.createLanguageService.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Language service profile created successfully",
      });
      form.reset();
      setCertifications([]);
      setPortfolioImages([]);
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
      ...data,
      certification: certifications,
      portfolio: portfolioImages,
      profileImage: data.profileImage ?? "/placeholder.png",
    });
  };

  const addCertification = () => {
    if (currentCertification.trim()) {
      setCertifications([...certifications, currentCertification]);
      setCurrentCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Separator className="my-6" />

        <FormSection
          title="Account Information"
          description="Create your login credentials"
          icon={<User className="h-5 w-5 text-blue-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                    <PasswordInput {...field} />
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
                    <PasswordInput {...field} placeholder="Confirm password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Personal Information"
          description="Your basic profile information"
          icon={<User className="h-5 w-5 text-purple-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name</FormLabel>
                  <FormDescription>
                    This will be your public display name
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Professional Translator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Srinagar, Kashmir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormDescription>Upload a professional photo</FormDescription>
                  <FormControl>
                    <div className="flex items-start gap-4">
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
          title="Professional Details"
          description="Describe your expertise and experience"
          icon={<Briefcase className="h-5 w-5 text-green-500" />}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormDescription>
                  Provide a detailed description of your language services
                  (minimum 50 characters)
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="I am a professional translator with expertise in..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Experience</FormLabel>
                <FormDescription>
                  Describe your professional experience (minimum 10 characters)
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="5+ years of experience in translation and interpretation..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualification"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Qualifications</FormLabel>
                <FormControl>
                  <Input
                    placeholder="M.A. in Linguistics, B.A. in English Literature"
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
          title="Language & Specialization"
          description="Select your languages and areas of expertise"
          icon={<Languages className="h-5 w-5 text-purple-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormDescription>
                    Select all languages you&apos;re proficient in
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {availableLanguages.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={lang}
                            checked={field.value.includes(lang)}
                            onCheckedChange={(checked) => {
                              const updatedLanguages = checked
                                ? [...field.value, lang]
                                : field.value.filter((l) => l !== lang);
                              field.onChange(updatedLanguages);
                            }}
                          />
                          <label
                            htmlFor={lang}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {lang}
                          </label>
                        </div>
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
                  <FormLabel>Specializations</FormLabel>
                  <FormDescription>
                    Select your areas of expertise
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3">
                      {specializationOptions.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={field.value.includes(spec)}
                            onCheckedChange={(checked) => {
                              const updatedSpecs = checked
                                ? [...field.value, spec]
                                : field.value.filter((s) => s !== spec);
                              field.onChange(updatedSpecs);
                            }}
                          />
                          <label
                            htmlFor={spec}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {spec}
                          </label>
                        </div>
                      ))}
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
          title="Service Details"
          description="Configure your service offerings"
          icon={<Monitor className="h-5 w-5 text-indigo-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="serviceMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Modes</FormLabel>
                  <FormDescription>
                    How do you provide your services?
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceModeOptions.map((mode) => (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox
                            id={mode}
                            checked={field.value.includes(mode)}
                            onCheckedChange={(checked) => {
                              const updatedModes = checked
                                ? [...field.value, mode]
                                : field.value.filter((m) => m !== mode);
                              field.onChange(updatedModes);
                            }}
                          />
                          <label
                            htmlFor={mode}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {mode}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minBookingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Booking Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxBookingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Booking Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="8"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Availability"
          description="Set your working hours and days"
          icon={<Calendar className="h-5 w-5 text-amber-500" />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={field.value.includes(day)}
                            onCheckedChange={(checked) => {
                              const updatedDays = checked
                                ? [...field.value, day]
                                : field.value.filter((d) => d !== day);
                              field.onChange(updatedDays);
                            }}
                          />
                          <label
                            htmlFor={day}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormSection>

        <Separator className="my-6" />

        <FormSection
          title="Certifications & Portfolio"
          description="Add your certifications and portfolio images"
          icon={<Award className="h-5 w-5 text-rose-500" />}
        >
          <div className="space-y-6">
            <div>
              <FormLabel>Certifications</FormLabel>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add certification (e.g., TOEFL, IELTS)"
                    value={currentCertification}
                    onChange={(e) => setCurrentCertification(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCertification();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        <span>{cert}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeCertification(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <FormLabel>Portfolio Images</FormLabel>
              <FormDescription>
                Upload samples of your work (max 6 images)
              </FormDescription>
              <div className="mt-2 space-y-3">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (portfolioImages.length < 6) {
                      setPortfolioImages([
                        ...portfolioImages,
                        res[0]?.appUrl ?? "",
                      ]);
                    } else {
                      toast({
                        title: "Limit Reached",
                        description:
                          "You can only upload up to 6 portfolio images",
                        variant: "destructive",
                      });
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Failed",
                      description: error.message,
                    });
                  }}
                />
              </div>
            </div>
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

// Password Input Component
const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter password",
  ...props
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
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
  );
};
