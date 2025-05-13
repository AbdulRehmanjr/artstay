"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useLogin } from "~/hooks/use-login";
import { api } from "~/trpc/react";
import {
  CheckCircle,
  User,
  LogIn,
  Clock,
  UserPlus,
  Store,
  Phone,
  Globe,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Timer,
  Award,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ShopCreationForm } from "~/components/join/shop/shop-form";
import { cn } from "~/lib/utils";

export const ShopRegistrationStatus = () => {
  const session = useSession();
  const { setIsLogin } = useLogin();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: shopData,
    isLoading: isLoadingApplication,
    refetch,
  } = api.shop.getApplicationStatus.useQuery(undefined, {
    enabled: !!session.data,
  });

  useEffect(() => {
    if (!isLoadingApplication) {
      setIsLoading(false);
    }
  }, [isLoadingApplication]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session.status]);

  useEffect(() => {
    if (session.status === "authenticated") {
      void refetch();
    }
  }, [session.status, refetch]);

  if (isLoading || session.status === "loading" || isLoadingApplication) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="font-medium text-gray-600">
            Checking application status...
          </span>
        </div>
      </div>
    );
  }

  // User is logged in and has an application
  if (session.status === "authenticated" && shopData) {
    const isApproved = shopData.isActive === true;

    return (
      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <div
          className={cn(
            "h-2 w-full",
            isApproved && "bg-green-500",
            !isApproved && "bg-primary",
          )}
        ></div>
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-full p-2",
                  isApproved && "bg-green-50",
                  !isApproved && "bg-primary/10",
                )}
              >
                {isApproved ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl">
                {isApproved ? "Shop Approved" : "Shop Under Review"}
              </CardTitle>
            </div>

            {/* Status Badge */}
            <Badge
              className={cn(
                "px-3 py-1 text-sm font-medium",
                isApproved && "bg-green-100 text-green-800 hover:bg-green-100",
                !isApproved && "bg-primary/10 text-primary hover:bg-primary/10",
              )}
            >
              {isApproved ? "APPROVED" : "PENDING REVIEW"}
            </Badge>
          </div>

          <CardDescription>
            {isApproved
              ? "Congratulations! Your shop has been approved. You can now access the shop dashboard."
              : "Your shop application is currently being reviewed by our team. We'll notify you once there's an update."}
          </CardDescription>
        </CardHeader>

        {/* Status Timeline */}
        <div className="border-y border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="mt-1 text-center text-xs font-medium">
                Submitted
              </div>
            </div>

            <div
              className={cn(
                "h-1 w-16",
                isApproved && "bg-green-500",
                !isApproved && "bg-gray-300",
              )}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isApproved && "bg-green-500 text-white",
                  !isApproved && "bg-primary text-white",
                )}
              >
                {isApproved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="mt-1 text-center text-xs font-medium">
                Under Review
              </div>
            </div>

            <div
              className={cn(
                "h-1 w-16",
                isApproved && "bg-green-500",
                !isApproved && "bg-gray-300",
              )}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isApproved && "bg-green-500 text-white",
                  !isApproved && "bg-gray-200 text-gray-500",
                )}
              >
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="mt-1 text-center text-xs font-medium">
                Approved
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          {/* Status Summary Box */}
          <div
            className={cn(
              "mb-6 rounded-lg border p-4",
              isApproved && "border-green-200 bg-green-50",
              !isApproved && "border-primary/20 bg-primary/5",
            )}
          >
            <div className="flex items-start gap-3">
              {isApproved ? (
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              ) : (
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
              )}
              <div>
                <h3
                  className={cn("font-medium", isApproved && "text-green-800")}
                >
                  Application Status:{" "}
                  <span className="font-bold">
                    {isApproved ? "APPROVED" : "PENDING REVIEW"}
                  </span>
                </h3>
                <p
                  className={cn(
                    isApproved && "text-green-700",
                    !isApproved && "text-primary/90",
                  )}
                >
                  {isApproved
                    ? "Your shop has been approved. You're now a verified vendor on our platform."
                    : "Your application is currently being reviewed by our team. This process typically takes 2-3 business days."}
                </p>
              </div>
            </div>
          </div>

          {/* Shop Details Section */}
          <div className="mt-4 space-y-8">
            {/* Shop Header with Image */}
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              {/* Shop Image */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border-4 border-primary/10">
                  {shopData.dp ? (
                    <Image
                      src={shopData.dp}
                      alt={shopData.shopName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Store className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {shopData.isGICertified && (
                  <Badge className="mt-3 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    <Award className="mr-1 h-3 w-3" />
                    GI Certified
                  </Badge>
                )}
              </div>

              {/* Shop Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="font-heading text-2xl font-bold">
                  {shopData.shopName}
                </h2>
                <p className="mt-1 text-lg text-gray-600">
                  {shopData.businessName}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                  <Badge variant="secondary">{shopData.vendorType}</Badge>
                  {shopData.isHandmade === "true" && (
                    <Badge variant="secondary">Handmade Products</Badge>
                  )}
                  {shopData.offersCustomization && (
                    <Badge variant="secondary">Custom Orders</Badge>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  <Badge
                    className={cn(
                      "px-3 py-1",
                      isApproved &&
                        "bg-green-100 text-green-800 hover:bg-green-100",
                      !isApproved &&
                        "bg-primary/10 text-primary hover:bg-primary/10",
                    )}
                  >
                    {isApproved ? "VERIFIED SHOP" : "VERIFICATION PENDING"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Shop Information Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Owner</p>
                      <p className="text-gray-600">{shopData.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">{shopData.phoneNumber}</p>
                    </div>
                  </div>

                  {shopData.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Website
                        </p>
                        <a
                          href={shopData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {shopData.website}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Store className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Shop ID
                      </p>
                      <p className="text-gray-600">{shopData.shopId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Address
                      </p>
                      <p className="text-gray-600">
                        {shopData.address}
                        <br />
                        {shopData.city}, {shopData.state}
                        <br />
                        {shopData.country} - {shopData.zipCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Timer className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Shop Timing
                      </p>
                      <p className="text-gray-600">{shopData.shopTiming}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Working Days
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {shopData.workingDays?.map((day, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product & Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Products & Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Product Categories
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {shopData.productCategories?.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Packaging
                      </p>
                      <p className="text-gray-600">{shopData.packagingType}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Description
                    </p>
                    <p className="mt-1 text-gray-600">{shopData.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pickup Options
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {shopData.pickupOptions?.map((option, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Delivery Time
                    </p>
                    <p className="text-gray-600">{shopData.deliveryTime}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Delivery Fee
                    </p>
                    <p className="text-gray-600">{shopData.deliveryFee}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Pricing Structure
                    </p>
                    <p className="text-gray-600">{shopData.pricingStructure}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Policies & Operations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Policies & Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Return Policy
                      </p>
                      <p className="text-gray-600">{shopData.returnPolicy}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Order Processing
                      </p>
                      <p className="text-gray-600">
                        {shopData.orderProcessing}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Stock Availability
                      </p>
                      <p className="text-gray-600">
                        {shopData.stockAvailability}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Payment Methods
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {shopData.paymentMethods?.map((method, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-4">
            {isApproved && (
              <Button variant="default" asChild>
                <Link href="/dashboard/shop" target="_blank">
                  <CheckCircle className="h-4 w-4" />
                  Go to Shop Dashboard
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is not logged in or doesn't have an application
  if (session.status === "unauthenticated" && !showForm) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Shop Registration
          </CardTitle>
          <CardDescription>
            Join our marketplace or check your application status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-4 rounded-xl border border-primary/10 bg-primary/5 p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-center text-lg font-medium">
                Already Applied?
              </h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;ve already submitted a shop registration, log in to
                check its status
              </p>
              <Button
                onClick={() => setIsLogin(true)}
                className="mt-auto w-full"
              >
                Login to Check Status
              </Button>
            </div>

            <div className="flex flex-col space-y-4 rounded-xl border border-primary/10 bg-primary/5 p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-center text-lg font-medium">
                New Shop Registration?
              </h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;re looking to register your shop on our platform,
                start your application
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-auto w-full"
              >
                Start Shop Application
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show the form
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowForm(false)}
          >
            <span className="sr-only">Go back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <CardTitle>Shop Application Form</CardTitle>
        </div>
        <CardDescription>
          Please fill in the details below to register your shop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShopCreationForm />
      </CardContent>
    </Card>
  );
};
