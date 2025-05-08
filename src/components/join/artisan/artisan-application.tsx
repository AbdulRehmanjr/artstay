"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useLogin } from "~/hooks/use-login";
import { api } from "~/trpc/react";
import {
  CheckCircle,
  User,
  Map,
  Calendar,
  Award,
  Book,
  Star,
  File,
  UserPlus,
  LogIn,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { ArtisanJoinForm } from "~/components/join/artisan/artisan-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const ArtisanRegistrationStatus = () => {
  const session = useSession();
  const { setIsLogin } = useLogin();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: artisanData,
    isLoading: isLoadingApplication,
    refetch,
  } = api.artisan.getApplicationStatus.useQuery(undefined, {
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
  if (session.status === "authenticated" && artisanData) {
    const isApproved = artisanData.isActive === true;

    return (
      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <div
          className={`h-2 w-full ${isApproved ? "bg-green-500" : "bg-primary"}`}
        ></div>
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-2 ${isApproved ? "bg-green-50" : "bg-primary/10"}`}
              >
                {isApproved ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl">
                {isApproved
                  ? "Application Approved"
                  : "Application Under Review"}
              </CardTitle>
            </div>

            {/* Status Badge - More Prominent */}
            <Badge
              className={`px-3 py-1 text-sm font-medium ${
                isApproved
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-primary/10 text-primary hover:bg-primary/10"
              }`}
            >
              {isApproved ? "APPROVED" : "PENDING REVIEW"}
            </Badge>
          </div>

          <CardDescription>
            {isApproved
              ? "Congratulations! Your application has been approved. You can now access the artisan dashboard."
              : "Your artisan application is currently being reviewed by our team. We'll notify you once there's an update."}
          </CardDescription>
        </CardHeader>

        {/* Status Timeline - New Addition */}
        <div className="border-y border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  true ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="mt-1 text-center text-xs font-medium">
                Submitted
              </div>
            </div>

            <div
              className={`h-1 w-16 ${
                isApproved ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isApproved
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white"
                }`}
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
              className={`h-1 w-16 ${
                isApproved ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isApproved
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isApproved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              <div className="mt-1 text-center text-xs font-medium">
                Approved
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          {/* Status Summary Box - New Addition */}
          <div
            className={`mb-6 rounded-lg border p-4 ${
              isApproved
                ? "border-green-200 bg-green-50"
                : "border-primary/20 bg-primary/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {isApproved ? (
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              ) : (
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
              )}
              <div>
                <h3
                  className={`font-medium ${
                    isApproved ? "text-green-800" : "text-primary-foreground"
                  }`}
                >
                  Application Status:{" "}
                  <span className="font-bold">
                    {isApproved ? "APPROVED" : "PENDING REVIEW"}
                  </span>
                </h3>
                <p
                  className={isApproved ? "text-green-700" : "text-primary/90"}
                >
                  {isApproved
                    ? "Your application has been approved. You're now a verified artisan on our platform."
                    : "Your application is currently being reviewed by our team. This process typically takes 2-3 business days."}
                </p>
              </div>
            </div>
          </div>

          {/* Artisan Details Section */}
          <div className="mt-4 space-y-6">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* Profile Image */}
              <div className="flex w-full flex-col items-center md:w-1/4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary/10">
                  {artisanData.dp ? (
                    <Image
                      src={artisanData.dp}
                      alt={`${artisanData.firstName} ${artisanData.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <User className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="mt-3 text-center font-heading text-xl font-semibold">
                  {artisanData.firstName} {artisanData.lastName}
                </h2>
                <div className="mt-1 text-center text-sm font-medium text-primary">
                  {artisanData.craft.craftName}{" "}
                  {artisanData.subCraft &&
                    `• ${artisanData.subCraft.subCraftName}`}
                </div>

                {/* Status Badge Under Profile - New Addition */}
                <Badge
                  className={`mt-3 px-3 py-1 ${
                    isApproved
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-primary/10 text-primary hover:bg-primary/10"
                  }`}
                >
                  {isApproved ? "VERIFIED ARTISAN" : "VERIFICATION PENDING"}
                </Badge>
              </div>

              {/* Artisan Information */}
              <div className="w-full space-y-4 md:w-3/4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Map className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Address
                      </h3>
                      <p className="text-gray-600">{artisanData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Experience
                      </h3>
                      <p className="text-gray-600">{artisanData.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Book className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Education
                      </h3>
                      <p className="text-gray-600">{artisanData.education}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Training
                      </h3>
                      <p className="text-gray-600">{artisanData.training}</p>
                    </div>
                  </div>

                  {artisanData.certificate && (
                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                      <File className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Certificates
                        </h3>
                        <p className="text-gray-600">
                          {artisanData.certificate}
                        </p>
                      </div>
                    </div>
                  )}

                  {artisanData.recongnition && (
                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                      <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Recognitions
                        </h3>
                        <p className="text-gray-600">
                          {artisanData.recongnition}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <h3 className="mb-1 text-sm font-medium text-gray-700">
                    Description
                  </h3>
                  <p className="text-gray-600">{artisanData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-4">
            {isApproved && (
              <Button variant="default" asChild>
                <Link href="/dashboard/artisan" target="_blank">
                  <CheckCircle className="h-4 w-4" />
                  Go to Artisan Dashboard
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">
                Return to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is not logged in or doesn't have an application
  // Show options or form based on state
  if (session.status === "unauthenticated" && !showForm) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Artisan Registration
          </CardTitle>
          <CardDescription>
            Join our network of skilled Kashmiri artisans or check your
            application status
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
                If you&apos;ve already submitted an application, log in to check
                its status
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
                New Applicant?
              </h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;re a skilled artisan looking to join our platform,
                start your application
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

  // Show the form if user clicked "Continue as New Applicant"
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
          <CardTitle>Artisan Application Form</CardTitle>
        </div>
        <CardDescription>
          Please fill in the details below to apply as an artisan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ArtisanJoinForm />
      </CardContent>
    </Card>
  );
};
