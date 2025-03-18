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
  import { api } from "~/trpc/react";
  import {
    Eye,
    EyeOff,
    Loader,
    MapPin,
    User,
    Clock,
    Calendar,
    Store,
    Package,
    ShoppingCart,
    Truck,
    FileCheck,
    CircleDollarSign,
  } from "lucide-react";
  import { Separator } from "~/components/ui/separator";
  import { useEffect, useState } from "react";
  import { Checkbox } from "~/components/ui/checkbox";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
  import { UploadDropzone } from "~/utils/uploadthing";

  const PRODUCT_CATEGORIES = [
    { id: "pashmina", label: "Pashmina & Woolen Products" },
    { id: "embroidery", label: "Embroidery & Textiles (Sozni, Aari, Crewel, etc.)" },
    { id: "papierMache", label: "Papier-Mâché Artworks" },
    { id: "woodCarving", label: "Wood Carving & Furniture" },
    { id: "copperware", label: "Copperware & Metal Engraving" },
    { id: "pottery", label: "Pottery & Ceramics" },
    { id: "wickerwork", label: "Wickerwork & Basketry" },
    { id: "khatamband", label: "Khatamband & Lattice Woodwork" },
    { id: "jewelry", label: "Handmade Jewelry" },
    { id: "leather", label: "Leather Goods" },
    { id: "other", label: "Other" },
  ];

  // Pickup options
  const PICKUP_OPTIONS = [
    { id: "shopPickup", label: "Tourist Pick-Up – Customers will visit your shop to collect their order" },
    { id: "hotelDelivery", label: "Hotel Delivery – Deliver to the customer's hotel within Srinagar" },
    { id: "localDelivery", label: "Local Home/Guesthouse Delivery – Deliver to designated Airbnb & houseboat stays" },
  ];

  // Payment methods
  const PAYMENT_METHODS = [
    { id: "cardPayment", label: "Credit/Debit Card" },
    { id: "upi", label: "UPI" },
    { id: "paypal", label: "PayPal" },
    { id: "cash", label: "Cash on Pickup" },
  ];

  // Days of the week
  const DAYS_OF_WEEK = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
  ];

  // Time options
  const TIME_OPTIONS = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
  ];

  const vendorFormSchema = z.object({
    // Account info
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number",
      ),
    confirmPassword: z.string(),

    // Business & Vendor Information
    businessName: z.string().min(3, "Business name must be at least 3 characters"),
    shopName: z.string().min(3, "Shop name must be at least 3 characters"),
    vendorType: z.enum(["Individual Artisan", "Cooperative", "Retailer", "Manufacturer"]),
    
    // Address
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().min(2, "Postal/ZIP code is required"),
    
    // Contact Information
    ownerName: z.string().min(3, "Owner/representative name is required"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
    website: z.string().optional(),
    
    // Shop Description
    description: z.string().min(20, "Description must be at least 20 characters"),
    
    // Product Categories
    productCategories: z.array(z.string()).min(1, "Select at least one product category"),
    otherCategory: z.string().optional(),
    isGICertified: z.boolean().default(false),
    isHandmade: z.enum(["Yes", "No", "Mixed"]),
    
    // Pickup & Delivery
    pickupOptions: z.array(z.string()).min(1, "Select at least one pickup/delivery option"),
    deliveryTime: z.enum(["Same Day", "Next Day", "Custom"]),
    customDeliveryHours: z.string().optional(),
    deliveryFee: z.string().optional(),
    
    // Pricing & Payment
    pricingStructure: z.enum(["Fixed Price", "Negotiable Prices", "Bulk Discounts Available"]),
    orderProcessing: z.enum(["Instant Confirmation", "Manual Confirmation Needed"]),
    paymentMethods: z.array(z.string()).min(1, "Select at least one payment method"),
    returnPolicy: z.string().optional(),
    
    // Inventory & Logistics
    stockAvailability: z.enum(["Ready Stock", "Made to Order", "Mixed"]),
    offersCustomization: z.boolean().default(false),
    packagingType: z.enum(["Eco-Friendly", "Standard", "Custom-Branded"]),
    
    // Shop timing
    openingTime: z.string().min(1, "Required"),
    openingPeriod: z.enum(["AM", "PM"]),
    closingTime: z.string().min(1, "Required"),
    closingPeriod: z.enum(["AM", "PM"]),
    workingDays: z.array(z.string()).min(1, "Select at least one working day"),
    
    // Vendor agreement
    agreedToTerms: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    agreedToBlacklist: z.boolean().refine(val => val === true, {
      message: "You must agree to the blacklist policy",
    }),
    
    // Display picture
    dp: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  type VendorFormInputProps = z.infer<typeof vendorFormSchema>;

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
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );

  export const ShopCreationForm = () => {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [otherCategorySelected, setOtherCategorySelected] = useState<boolean>(false);
    const [customDeliverySelected, setCustomDeliverySelected] = useState<boolean>(false);

    const form = useForm<VendorFormInputProps>({
      resolver: zodResolver(vendorFormSchema),
      defaultValues: {
        vendorType: "Individual Artisan",
        productCategories: [],
        pickupOptions: [],
        paymentMethods: [],
        workingDays: [],
        openingPeriod: "AM",
        closingPeriod: "PM",
        isHandmade: "Mixed",
        pricingStructure: "Fixed Price",
        orderProcessing: "Instant Confirmation",
        stockAvailability: "Ready Stock",
        packagingType: "Standard",
        deliveryTime: "Next Day",
        isGICertified: false,
        offersCustomization: false,
        agreedToTerms: false,
        agreedToBlacklist: false,
      },
    });

    // Watch for changes in certain fields
    const watchProductCategories = form.watch("productCategories");
    const watchDeliveryTime = form.watch("deliveryTime");

    // Update state based on watched values
    useEffect(() => {
      setOtherCategorySelected(watchProductCategories.includes("other"));
    }, [watchProductCategories]);

    useEffect(() => {
      setCustomDeliverySelected(watchDeliveryTime === "Custom");
    }, [watchDeliveryTime]);

    const registerVendor = api.register.createShop.useMutation({
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Your vendor application has been submitted successfully.",
        });
        form.reset();
        window.scrollTo(0, 0);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const onSubmit = async (data: VendorFormInputProps) => {

      const shopTiming = `${data.openingTime} ${data.openingPeriod} - ${data.closingTime} ${data.closingPeriod}`;

      let processedProductCategories = [...data.productCategories];
      if (data.otherCategory && data.productCategories.includes("other")) {
        processedProductCategories = processedProductCategories.filter(cat => cat !== "other");
        processedProductCategories.push(`other: ${data.otherCategory}`);
      }

      let deliveryTimeValue = data.deliveryTime;
      if (data.deliveryTime === "Custom" && data.customDeliveryHours) {
        deliveryTimeValue = `Custom (${data.customDeliveryHours} Hours)` as "Same Day" | "Next Day" | "Custom";
      }

      registerVendor.mutate({
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        shopName: data.shopName,
        vendorType: data.vendorType,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        ownerName: data.ownerName,
        phoneNumber: data.phoneNumber,
        website: data.website ?? "",
        description: data.description,
        productCategories: processedProductCategories,
        isGICertified: data.isGICertified,
        isHandmade: data.isHandmade,
        pickupOptions: data.pickupOptions,
        deliveryTime: deliveryTimeValue,
        deliveryFee: data.deliveryFee ?? "Free",
        pricingStructure: data.pricingStructure,
        orderProcessing: data.orderProcessing,
        paymentMethods: data.paymentMethods,
        returnPolicy: data.returnPolicy ?? "Standard 7-day return policy",
        stockAvailability: data.stockAvailability,
        offersCustomization: data.offersCustomization,
        packagingType: data.packagingType,
        shopTiming: shopTiming,
        workingDays: data.workingDays,
        agreedToTerms: data.agreedToTerms,
        agreedToBlacklist: data.agreedToBlacklist,
        dp: data.dp ?? "/placeholder-shop.png",
      });
    };

    return (
      <>
        <div className="mb-8">
          <h3 className="mb-2 text-3xl font-bold font-heading">ArtStay Marketplace</h3>
          <h4 className="mb-4 text-xl font-semibold font-heading">Vendor Registration Form</h4>
          <p className="text-gray-600">
            Join the ArtStay Marketplace! This platform connects tourists with authentic 
            Kashmiri handicraft vendors. Tourists can purchase crafts online and either 
            pick up from your shop or have them delivered to their hotel for a seamless 
            cultural shopping experience.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormSection
              title="Account Information"
              description="Create your account credentials"
              icon={<User className="h-6 w-6 text-blue-500" />}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
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
                              value={field.value ?? ""}
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
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Order & Delivery Options"
              description="How customers can receive their purchases"
              icon={<Truck className="h-6 w-6 text-indigo-500" />}
            >
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="pickupOptions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Pickup & Delivery Options</FormLabel>
                        <FormDescription>
                          Select all options that you can provide
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {PICKUP_OPTIONS.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="pickupOptions"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedOptions = checked
                                        ? [...field.value, option.id]
                                        : field.value?.filter(
                                            (value) => value !== option.id
                                          );
                                      field.onChange(updatedOptions);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time Commitment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Same Day">Same Day (Within 12 Hours)</SelectItem>
                            <SelectItem value="Next Day">Next Day (Within 24 Hours)</SelectItem>
                            <SelectItem value="Custom">Custom Hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {customDeliverySelected && (
                    <FormField
                      control={form.control}
                      name="customDeliveryHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Custom Hours</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 48"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="deliveryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Fee (If Any)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., ₹100 or Free"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Pricing & Payment Options"
              description="Details about your pricing structure and payment options"
              icon={<CircleDollarSign className="h-6 w-6 text-green-600" />}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pricingStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Structure</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                          <SelectItem value="Negotiable Prices">Negotiable Prices</SelectItem>
                          <SelectItem value="Bulk Discounts Available">Bulk Discounts Available</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderProcessing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Processing</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Instant Confirmation">Instant Confirmation</SelectItem>
                          <SelectItem value="Manual Confirmation Needed">Manual Confirmation Needed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Return & Refund Policy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your return and refund policy..."
                          className="min-h-[100px]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethods"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <div className="mb-4">
                        <FormLabel>Accepted Payment Methods</FormLabel>
                        <FormDescription>
                          Select all payment methods you accept
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {PAYMENT_METHODS.map((method) => (
                          <FormField
                            key={method.id}
                            control={form.control}
                            name="paymentMethods"
                            render={({ field }) => (
                              <FormItem
                                key={method.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(method.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedMethods = checked
                                        ? [...field.value, method.id]
                                        : field.value?.filter(
                                            (value) => value !== method.id
                                          );
                                      field.onChange(updatedMethods);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {method.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              title="Inventory & Packaging"
              description="Details about your stock and packaging options"
              icon={<ShoppingCart className="h-6 w-6 text-amber-600" />}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="stockAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ready Stock">Ready Stock</SelectItem>
                          <SelectItem value="Made to Order">Made to Order</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packagingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packaging Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Custom-Branded">Custom-Branded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offersCustomization"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          My shop offers customization for tourists
                        </FormLabel>
                        <FormDescription>
                          Custom orders, personalization, or made-to-order items
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              title="Business & Vendor Information"
              description="Basic information about your business and shop"
              icon={<Store className="h-6 w-6 text-green-500" />}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Business Name"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormDescription>If different from business name</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Your Shop Name"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vendorType"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Vendor Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {["Individual Artisan", "Cooperative", "Retailer", "Manufacturer"].map((type) => (
                            <FormItem 
                              key={type} 
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={type} id={`vendor-type-${type}`} />
                              </FormControl>
                              <FormLabel className="font-normal" htmlFor={`vendor-type-${type}`}>
                                {type}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dp"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Shop Display Picture</FormLabel>
                      <FormControl>
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0]?.url);
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              title="Contact & Location"
              description="Your shop address and contact information"
              icon={<MapPin className="h-6 w-6 text-purple-500" />}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Representative Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Name"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website/Social Media (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://yourwebsite.com"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street Address"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State/Province"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Zip/Postal Code"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              title="Product Information"
              description="Tell us about the products you offer"
              icon={<Package className="h-6 w-6 text-yellow-500" />}
            >
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Description</FormLabel>
                      <FormDescription>
                        Describe your shop, products, and what makes them special
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Tell potential customers about your products, services, and what makes your shop unique..."
                          className="min-h-[120px]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productCategories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Product Categories</FormLabel>
                        <FormDescription>
                          Select all product categories that apply to your shop
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {PRODUCT_CATEGORIES.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="productCategories"
                            render={({ field }) => (
                              <FormItem
                                key={category.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedCategories = checked
                                        ? [...field.value, category.id]
                                        : field.value?.filter(
                                            (value) => value !== category.id
                                          );
                                      field.onChange(updatedCategories);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {category.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {otherCategorySelected && (
                  <FormField
                    control={form.control}
                    name="otherCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please Specify Other Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Specify other product category"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                  <FormField
                    control={form.control}
                    name="isGICertified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            My shop offers GI-Certified Products
                          </FormLabel>
                          <FormDescription>
                            Geographical Indication certified authentic products
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormSection>
            <FormSection
              title="Shop Hours"
              description="When your shop is open for business"
              icon={<Clock className="h-6 w-6 text-orange-500" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 font-medium">Opening Time</p>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="openingTime"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_OPTIONS.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
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
                        name="openingPeriod"
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="AM/PM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-medium">Closing Time</p>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="closingTime"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_OPTIONS.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
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
                        name="closingPeriod"
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="AM/PM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            <Separator className="my-6" />

            <FormSection
              title="Working Days"
              description="Select which days your shop is open"
              icon={<Calendar className="h-6 w-6 text-red-500" />}
            >
              <FormField
                control={form.control}
                name="workingDays"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="workingDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            day.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.value,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <Separator className="my-6" />

            <FormSection
              title="Vendor Agreement & Compliance"
              description="Terms and conditions for ArtStay Marketplace vendors"
              icon={<FileCheck className="h-6 w-6 text-blue-600" />}
            >
              <div className="space-y-6">
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-2 font-semibold text-amber-800">Vendor Agreement</h4>
                  <ul className="ml-2 space-y-2 text-sm text-amber-800">
                    <li>• I agree to list only authentic, handmade Kashmiri handicrafts on ArtStay Marketplace.</li>
                    <li>• I will ensure timely pickup or delivery of all customer orders.</li>
                    <li>• I commit to fair pricing and ethical trade practices.</li>
                    <li>• I understand that ArtStay Marketplace holds payment until order fulfillment is confirmed.</li>
                    <li>• I allow ArtStay to market my shop & products to international tourists.</li>
                  </ul>
                </div>

                <FormField
                  control={form.control}
                  name="agreedToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I agree to the ArtStay Marketplace vendor terms and conditions
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="rounded-md border border-red-100 bg-red-50 p-4">
                  <h4 className="mb-2 font-semibold text-red-800">⚠️ Vendor Compliance & Blacklist Policy</h4>
                  <p className="mb-2 text-sm text-red-700">
                    Vendors who violate the following ArtStay Marketplace policies will be reported and blacklisted in the CraftLore Blacklist Database:
                  </p>
                  <ul className="ml-2 space-y-2 text-sm text-red-700">
                    <li>1️⃣ Quality Compliance: Selling counterfeit or low-quality products instead of genuine handicrafts.</li>
                    <li>2️⃣ Pricing Integrity: Overpricing, hidden fees, or fraudulent price manipulation.</li>
                    <li>3️⃣ Delivery Violations: Failing to fulfill orders on time or refusing agreed-upon pick-up/delivery services.</li>
                    <li>4️⃣ Refund & Customer Satisfaction: Rejecting valid refund claims or failing to address quality complaints.</li>
                  </ul>
                  <p className="mt-2 text-sm text-red-700">
                    Blacklisted vendors will be permanently removed from ArtStay Marketplace and will lose access to future business opportunities under the CraftLore initiative.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="agreedToBlacklist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I understand and agree to the CraftLore Blacklist Policy and will adhere to ArtStay&apos;s compliance standards
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <Separator className="my-6" />

            <div className="flex flex-col items-center justify-center space-y-4">
              <Button
                type="submit"
                disabled={registerVendor.isPending}
              >
                {registerVendor.isPending ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing Application...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Submit Vendor Application</span>
                  </div>
                )}
              </Button>

              {registerVendor.isPending && (
                <p className="text-center text-sm text-gray-500">
                  Please wait while we process your vendor registration...
                </p>
              )}

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Limited vendor spots available. Join Kashmir&apos;s first tourism-handicraft convergence program!</p>
                <p className="mt-2">
                  For assistance, contact us at <span className="text-blue-600">info@dekoshurcrafts.com</span>
                </p>
              </div>
            </div>
          </form>
        </Form>
      </>
    );
  };
