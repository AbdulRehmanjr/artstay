"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Loader2, Plus, X, Camera } from "lucide-react";
import { useSession } from "next-auth/react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";

import { toast } from "~/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  profileImage: z.string().optional(),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  location: z.string().min(1, { message: "Location is required" }),
  yearsOfExperience: z.number().min(0, { message: "Please enter a valid number" }),
  expertise: z.array(z.string()).min(1, { message: "At least one expertise is required" }),
  equipment: z.array(z.string()).min(1, { message: "At least one equipment is required" }),
  documentationStyle: z.array(z.string()).min(1, { message: "At least one documentation style is required" }),
  mediaTypes: z.array(z.string()).min(1, { message: "At least one media type is required" }),
  portfolioLinks: z.array(z.string()).optional(),
  documentedCrafts: z.array(
    z.object({
      craftName: z.string().min(1, { message: "Craft name is required" }),
      region: z.string().min(1, { message: "Region is required" }),
      description: z.string().min(10, { message: "Description must be at least 10 characters" }),
      mediaUrls: z.array(z.string()).optional(),
    })
  ).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CraftDocumentorForm = () => {

  const { data: sessionData } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [documentationStyles, setDocumentationStyles] = useState<string[]>([]);
  const [newDocumentationStyle, setNewDocumentationStyle] = useState("");
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [newMediaType, setNewMediaType] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [documentedCrafts, setDocumentedCrafts] = useState<
    {
      craftName: string;
      region: string;
      description: string;
      mediaUrls: string[];
    }[]
  >([]);

  const createProfile = api.document.createProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your application has been submitted successfully!",
      });
      setIsSubmitting(false);
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profileImage: "",
      bio: "",
      location: "",
      yearsOfExperience: 0,
      expertise: [],
      equipment: [],
      documentationStyle: [],
      mediaTypes: [],
      portfolioLinks: [],
      documentedCrafts: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!sessionData) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Add the arrays to the form values
    values.expertise = expertise;
    values.equipment = equipment;
    values.documentationStyle = documentationStyles;
    values.mediaTypes = mediaTypes;
    values.portfolioLinks = portfolioLinks;
    values.documentedCrafts = documentedCrafts;

    createProfile.mutate(values);
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (item: string) => {
    setExpertise(expertise.filter((exp) => exp !== item));
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment("");
    }
  };

  const removeEquipment = (item: string) => {
    setEquipment(equipment.filter((eq) => eq !== item));
  };

  const addDocumentationStyle = () => {
    if (
      newDocumentationStyle.trim() &&
      !documentationStyles.includes(newDocumentationStyle.trim())
    ) {
      setDocumentationStyles([
        ...documentationStyles,
        newDocumentationStyle.trim(),
      ]);
      setNewDocumentationStyle("");
    }
  };

  const removeDocumentationStyle = (item: string) => {
    setDocumentationStyles(
      documentationStyles.filter((style) => style !== item)
    );
  };

  const addMediaType = () => {
    if (newMediaType.trim() && !mediaTypes.includes(newMediaType.trim())) {
      setMediaTypes([...mediaTypes, newMediaType.trim()]);
      setNewMediaType("");
    }
  };

  const removeMediaType = (item: string) => {
    setMediaTypes(mediaTypes.filter((type) => type !== item));
  };

  const addPortfolioLink = () => {
    if (
      newPortfolioLink.trim() &&
      !portfolioLinks.includes(newPortfolioLink.trim())
    ) {
      setPortfolioLinks([...portfolioLinks, newPortfolioLink.trim()]);
      setNewPortfolioLink("");
    }
  };

  const removePortfolioLink = (item: string) => {
    setPortfolioLinks(portfolioLinks.filter((link) => link !== item));
  };

  const addDocumentedCraft = () => {
    setDocumentedCrafts([
      ...documentedCrafts,
      {
        craftName: "",
        region: "",
        description: "",
        mediaUrls: [],
      },
    ]);
  };

  const removeDocumentedCraft = (index: number) => {
    setDocumentedCrafts(
      documentedCrafts.filter((_, craftIndex) => craftIndex !== index)
    );
  };

  const updateDocumentedCraft = (
    index: number,
    field: keyof (typeof documentedCrafts)[0],
    value: string
  ) => {
    const updatedCrafts = [...documentedCrafts];
    const craft = updatedCrafts[index];
    if (!craft) return;
    if (field === "craftName" || field === "region" || field === "description") {
      craft[field] = value;
      setDocumentedCrafts(updatedCrafts);
    }
    // Do not allow direct assignment for 'mediaUrls'
  };

  const addMediaUrl = (craftIndex: number, url: string) => {
    if (!url.trim()) return;
    
    const updatedCrafts = [...documentedCrafts];
    if (!updatedCrafts[craftIndex]) return;
    if (!updatedCrafts[craftIndex].mediaUrls) {
      updatedCrafts[craftIndex].mediaUrls = [];
    }
    updatedCrafts[craftIndex].mediaUrls.push(url.trim());
    setDocumentedCrafts(updatedCrafts);
  };

  const removeMediaUrl = (craftIndex: number, urlIndex: number) => {
    const updatedCrafts = [...documentedCrafts];
    if (updatedCrafts[craftIndex]?.mediaUrls) {
      updatedCrafts[craftIndex].mediaUrls = updatedCrafts[craftIndex].mediaUrls.filter(
        (_, idx) => idx !== urlIndex
      );
    }
    setDocumentedCrafts(updatedCrafts);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide your personal and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
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
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL to your profile image"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide a URL to your profile image
                  </FormDescription>
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
                    <Input
                      placeholder="City, Country"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Where are you primarily based?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    How many years have you been documenting crafts?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself, your background, and your approach to craft documentation"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your public profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Details about your expertise and equipment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Expertise */}
            <div>
              <FormLabel>Areas of Expertise</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {expertise.map((item, index) => (
                  <Badge key={index} variant="secondary" className="p-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeExpertise(item)}
                      className="ml-2 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add area of expertise"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExpertise();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExpertise}
                  disabled={!newExpertise.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.expertise && (
                <p className="mt-2 text-sm font-medium text-destructive">
                  {form.formState.errors.expertise.message}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Add your areas of expertise in craft documentation (e.g., Traditional Textiles, Pottery, Wood Carving)
              </p>
            </div>

            {/* Equipment */}
            <div>
              <FormLabel>Equipment Used</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="p-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeEquipment(item)}
                      className="ml-2 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add equipment"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEquipment();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEquipment}
                  disabled={!newEquipment.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.equipment && (
                <p className="mt-2 text-sm font-medium text-destructive">
                  {form.formState.errors.equipment.message}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                List the equipment you use (e.g., Sony A7III, DJI Mavic Air 2, Zoom H4n Pro)
              </p>
            </div>

            {/* Documentation Styles */}
            <div>
              <FormLabel>Documentation Styles</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {documentationStyles.map((item, index) => (
                  <Badge key={index} variant="secondary" className="p-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeDocumentationStyle(item)}
                      className="ml-2 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add documentation style"
                  value={newDocumentationStyle}
                  onChange={(e) => setNewDocumentationStyle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDocumentationStyle();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDocumentationStyle}
                  disabled={!newDocumentationStyle.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.documentationStyle && (
                <p className="mt-2 text-sm font-medium text-destructive">
                  {form.formState.errors.documentationStyle.message}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Your documentation approaches (e.g., Narrative Documentary, Process-focused, Cultural Context)
              </p>
            </div>

            {/* Media Types */}
            <div>
              <FormLabel>Media Types</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {mediaTypes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="p-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMediaType(item)}
                      className="ml-2 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add media type"
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMediaType();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMediaType}
                  disabled={!newMediaType.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.mediaTypes && (
                <p className="mt-2 text-sm font-medium text-destructive">
                  {form.formState.errors.mediaTypes.message}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Types of media you produce (e.g., Photography, Video, Audio, Written Documentation)
              </p>
            </div>

            {/* Portfolio Links */}
            <div>
              <FormLabel>Portfolio Links</FormLabel>
              <div className="mt-2 flex flex-col gap-2">
                {portfolioLinks.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} disabled />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePortfolioLink(item)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add portfolio link"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPortfolioLink();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPortfolioLink}
                  disabled={!newPortfolioLink.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Links to your existing portfolio or previous work (website, Vimeo, YouTube, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documented Crafts */}
        <Card>
          <CardHeader>
            <CardTitle>Documented Crafts</CardTitle>
            <CardDescription>
              Share examples of crafts you have documented
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documentedCrafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Camera className="mb-2 h-8 w-8 text-gray-400" />
                <h3 className="text-lg font-medium">No crafts added yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add examples of crafts you have documented
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDocumentedCraft}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Craft
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  {documentedCrafts.map((craft, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base">
                          {craft.craftName
                            ? craft.craftName
                            : `Documented Craft ${index + 1}`}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocumentedCraft(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <FormLabel>Craft Name</FormLabel>
                            <Input
                              value={craft.craftName}
                              onChange={(e) =>
                                updateDocumentedCraft(
                                  index,
                                  "craftName",
                                  e.target.value
                                )
                              }
                              placeholder="Name of the craft"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <FormLabel>Region</FormLabel>
                            <Input
                              value={craft.region}
                              onChange={(e) =>
                                updateDocumentedCraft(
                                  index,
                                  "region",
                                  e.target.value
                                )
                              }
                              placeholder="Region or origin"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            value={craft.description}
                            onChange={(e) =>
                              updateDocumentedCraft(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Describe the craft and your documentation process"
                            rows={3}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <FormLabel>Media URLs</FormLabel>
                          <div className="mt-2 space-y-2">
                            {craft.mediaUrls?.map((url, urlIndex) => (
                              <div key={urlIndex} className="flex items-center gap-2">
                                <Input value={url} disabled />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeMediaUrl(index, urlIndex)}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Input
                              placeholder="Add media URL"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addMediaUrl(index, e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addMediaUrl(index, input.value);
                                input.value = "";
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            URLs to images or videos showcasing this craft
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDocumentedCraft}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Craft
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </form>
    </Form>
  );
};