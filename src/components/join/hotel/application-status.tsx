"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useLogin } from "~/hooks/use-login";
import { api } from "~/trpc/react";
import {
  CheckCircle,
  Clock,
  LogIn,
  UserPlus,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { HotelServiceForm } from "~/components/join/hotel/hotel-form";

export const HotelRegistrationStatus = () => {
  const session = useSession();
  const { setIsLogin } = useLogin();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: hotelData,
    isLoading: isLoadingApplication,
    refetch,
  } = api.hotel.getApplicationStatus.useQuery(undefined, {
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
  if (session.status === "authenticated" && hotelData) {
    const isApproved = hotelData.isActive === true;

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
                {isApproved
                  ? "Hotel Registration Approved"
                  : "Hotel Registration Under Review"}
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
              ? "Congratulations! Your hotel registration has been approved. You can now access the hotel management dashboard."
              : "Your hotel registration application is currently being reviewed by our team. We'll notify you once there's an update."}
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
                    ? "Your hotel registration has been approved. You're now a verified hotel partner on our platform."
                    : "Your application is currently being reviewed by our team. This process typically takes 2-3 business days."}
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Details Section */}
          <div className="mt-4 space-y-8">
            {/* Hotel Header */}
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold">
                {hotelData.name}
              </h2>
              <p className="mt-2 text-gray-600">
                Hotel ID: {hotelData.code}
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="mr-1 h-3 w-3" />
                  {hotelData.address}
                </Badge>
              </div>

              <Badge
                className={cn(
                  "mt-4 px-3 py-1",
                  isApproved &&
                    "bg-green-100 text-green-800 hover:bg-green-100",
                  !isApproved &&
                    "bg-primary/10 text-primary hover:bg-primary/10",
                )}
              >
                {isApproved ? "VERIFIED HOTEL PARTNER" : "VERIFICATION PENDING"}
              </Badge>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Hotel Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hotel Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Hotel Name
                      </p>
                      <p className="text-gray-600">{hotelData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Hotel Code
                      </p>
                      <p className="text-gray-600">{hotelData.code}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Address
                      </p>
                      <p className="text-gray-600">{hotelData.address}</p>
                    </div>
                  </div>

                  {hotelData.latitude !== 0 && hotelData.longitude !== 0 && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Coordinates
                        </p>
                        <p className="text-gray-600">
                          {hotelData.latitude}°, {hotelData.longitude}°
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact & Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Owner Name
                      </p>
                      <p className="text-gray-600">
                        {hotelData.firstName} {hotelData.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Email
                      </p>
                      <p className="text-gray-600">{hotelData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Phone Number
                      </p>
                      <p className="text-gray-600">{hotelData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Timer className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Check-in / Check-out
                      </p>
                      <p className="text-gray-600">
                        {hotelData.checkIn} - {hotelData.checkOut}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hotel Description */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Hotel Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{hotelData.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-4">
            {isApproved && (
              <Button variant="default" asChild>
                <Link href="/dashboard/hotel" target="_blank">
                  <CheckCircle className="h-4 w-4" />
                  Go to Hotel Management Dashboard
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
            Hotel Partner Registration
          </CardTitle>
          <CardDescription>
            Join our hotel network or check your application status
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
                If you&apos;ve already submitted a hotel registration, log in to
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
                New Hotel Partner?
              </h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;re looking to list your hotel on our platform, start
                your registration
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-auto w-full"
              >
                Start Registration
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
          <CardTitle>Hotel Registration Form</CardTitle>
        </div>
        <CardDescription>
          Please fill in the details below to register your hotel as a partner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HotelServiceForm />
      </CardContent>
    </Card>
  );
};