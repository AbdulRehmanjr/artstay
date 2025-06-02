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
  Languages,
  MapPin,
  Briefcase,
  Star,
  Monitor,
  Award,
  Calendar,
  DollarSign,
  Timer,
  User,
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
import { LanguageServiceForm } from "~/components/join/language/language-form";
import { cn } from "~/lib/utils";

export const LanguageServiceRegistrationStatus = () => {
  const session = useSession();
  const { setIsLogin } = useLogin();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: languageData,
    isLoading: isLoadingApplication,
    refetch,
  } = api.language.getApplicationStatus.useQuery(undefined, {
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
  if (session.status === "authenticated" && languageData) {
    const isApproved = languageData.isActive === true;

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
                  ? "Language Service Approved"
                  : "Language Service Under Review"}
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
              ? "Congratulations! Your language service profile has been approved. You can now access the dashboard."
              : "Your language service application is currently being reviewed by our team. We'll notify you once there's an update."}
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
                    ? "Your language service profile has been approved. You're now a verified language service provider on our platform."
                    : "Your application is currently being reviewed by our team. This process typically takes 2-3 business days."}
                </p>
              </div>
            </div>
          </div>

          {/* Language Service Details Section */}
          <div className="mt-4 space-y-8">
            {/* Provider Header */}
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              {/* Profile Image */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary/10">
                  {languageData.profileImage &&
                  languageData.profileImage !== "none" &&
                  languageData.profileImage !== "" ? (
                    <Image
                      src={languageData.profileImage}
                      alt={`${languageData.firstName} ${languageData.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.png"
                      alt="Placeholder"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                {languageData.rating > 0 && (
                  <div className="mt-3 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {languageData.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="font-heading text-2xl font-bold">
                  {languageData.profileName !== "none"
                    ? languageData.profileName
                    : `${languageData.firstName} ${languageData.lastName}`}
                </h2>
                <p className="mt-2 text-gray-600">
                  {languageData.experience !== "none"
                    ? languageData.experience
                    : "Professional Language Service Provider"}
                </p>

                {/* Languages */}
                {languageData.languages &&
                  languageData.languages.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                      {languageData.languages.map((lang, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Languages className="mr-1 h-3 w-3" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}

                {/* Service Modes */}
                {languageData.serviceMode &&
                  languageData.serviceMode.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-2 lg:justify-start">
                      {languageData.serviceMode.map((mode, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <Monitor className="mr-1 h-3 w-3" />
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  )}

                <Badge
                  className={cn(
                    "mt-4 px-3 py-1",
                    isApproved &&
                      "bg-green-100 text-green-800 hover:bg-green-100",
                    !isApproved &&
                      "bg-primary/10 text-primary hover:bg-primary/10",
                  )}
                >
                  {isApproved ? "VERIFIED PROVIDER" : "VERIFICATION PENDING"}
                </Badge>
              </div>
            </div>

            {/* Detailed Information Sections */}
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
                      <p className="text-sm font-medium text-gray-700">
                        Full Name
                      </p>
                      <p className="text-gray-600">
                        {languageData.firstName}{" "}
                        {languageData.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Service ID
                      </p>
                      <p className="text-gray-600">
                        {languageData.languageServiceId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Qualification
                      </p>
                      <p className="text-gray-600">
                        {languageData.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Location
                      </p>
                      <p className="text-gray-600">
                        {languageData.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pricing & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Hourly Rate
                      </p>
                      <p className="text-gray-600">
                        ${languageData.hourlyRate}/hour
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Timer className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Booking Hours
                      </p>
                      <p className="text-gray-600">
                        Min: {languageData.minBookingHours} hours | Max:{" "}
                        {languageData.maxBookingHours} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Working Hours
                      </p>
                      <p className="text-gray-600">
                        {languageData.startTime} -{" "}
                        {languageData.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Availability
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {languageData.availability?.map((day, index) => (
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

              {/* Expertise & Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Expertise & Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Specializations
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {languageData.specialization?.map(
                        (spec, index) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Certifications
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {languageData.certification?.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          <Award className="mr-1 h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Description
                    </p>
                    <p className="mt-1 text-gray-600">
                      {languageData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio */}
              {languageData.portfolio &&
                languageData.portfolio.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {languageData.portfolio.map((item, index) => (
                          <div
                            key={index}
                            className="relative aspect-video overflow-hidden rounded-lg border"
                          >
                            <Image
                              src={item}
                              alt={`Portfolio item ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-4">
            {isApproved && (
              <Button variant="default" asChild>
                <Link href="/dashboard/language-service" target="_blank">
                  <CheckCircle className="h-4 w-4" />
                  Go to Language Service Dashboard
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
            Language Service Registration
          </CardTitle>
          <CardDescription>
            Join our network or check your application status
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
                If you&apos;ve already submitted a language service
                registration, log in to check its status
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
                New Language Service Provider?
              </h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;re looking to offer language services on our
                platform, start your application
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-auto w-full"
              >
                Start Application
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
          <CardTitle>Language Service Application Form</CardTitle>
        </div>
        <CardDescription>
          Please fill in the details below to register as a language service
          provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageServiceForm />
      </CardContent>
    </Card>
  );
};
