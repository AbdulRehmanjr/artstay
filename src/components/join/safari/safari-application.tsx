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
  UserPlus, 
  LogIn,
  Clock,
  Car,
  TentTree
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { SafariForm } from "~/components/join/safari/safari-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const SafariRegistrationStatus = () => {
  const session = useSession();
  const { setIsLogin } = useLogin();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { data: safariData, isLoading: isLoadingApplication, refetch } = api.safari.getApplicationStatus.useQuery(
    undefined, 
    {
      enabled: !!session.data
    },
  );

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
          <span className="text-gray-600 font-medium">Checking application status...</span>
        </div>
      </div>
    );
  }

  // User is logged in and has an application
  if (session.status === "authenticated" && safariData) {
    const isApproved = safariData.isActive === true;
    
    return (
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className={`w-full h-2 ${isApproved ? "bg-green-500" : "bg-primary"}`}></div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isApproved ? "bg-green-50" : "bg-primary/10"}`}>
                {isApproved ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl">
                {isApproved ? "Application Approved" : "Application Under Review"}
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
              ? "Congratulations! Your application has been approved. You can now access the safari guide dashboard."
              : "Your safari guide application is currently being reviewed by our team. We'll notify you once there's an update."
            }
          </CardDescription>
        </CardHeader>
        
        {/* Status Timeline - New Addition */}
        <div className="px-6 py-3 bg-gray-50 border-y border-gray-200">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                true ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium mt-1 text-center">Submitted</div>
            </div>
            
            <div className={`h-1 w-16 ${
              isApproved ? "bg-green-500" : "bg-gray-300"
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                isApproved ? "bg-green-500 text-white" : "bg-primary text-white"
              }`}>
                {isApproved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="text-xs font-medium mt-1 text-center">Under Review</div>
            </div>
            
            <div className={`h-1 w-16 ${
              isApproved ? "bg-green-500" : "bg-gray-300"
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                isApproved ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {isApproved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              <div className="text-xs font-medium mt-1 text-center">Approved</div>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-6">
          {/* Status Summary Box - New Addition */}
          <div className={`mb-6 p-4 rounded-lg border ${
            isApproved 
              ? "bg-green-50 border-green-200" 
              : "bg-primary/5 border-primary/20"
          }`}>
            <div className="flex items-start gap-3">
              {isApproved ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <Clock className="h-5 w-5 text-primary mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${
                  isApproved ? "text-green-800" : "text-primary-foreground"
                }`}>
                  Application Status: <span className="font-bold">{isApproved ? "APPROVED" : "PENDING REVIEW"}</span>
                </h3>
                <p className={isApproved ? "text-green-700" : "text-primary/90"}>
                  {isApproved 
                    ? "Your application has been approved. You're now a verified safari guide on our platform." 
                    : "Your application is currently being reviewed by our team. This process typically takes 2-3 business days."}
                </p>
              </div>
            </div>
          </div>
          
          {/* Safari Details Section */}
          <div className="mt-4 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="w-full md:w-1/4 flex flex-col items-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-primary/10">
                  {safariData.dp ? (
                    <Image 
                      src={safariData.dp} 
                      alt={`${safariData.firstName} ${safariData.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <User className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="font-heading text-xl font-semibold text-center mt-3">
                  {safariData.firstName} {safariData.lastName}
                </h2>
                <div className="mt-1 text-sm text-center text-primary font-medium">
                  Safari Guide
                </div>
                
                {/* Status Badge Under Profile - New Addition */}
                <Badge 
                  className={`mt-3 px-3 py-1 ${
                    isApproved 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-primary/10 text-primary hover:bg-primary/10"
                  }`}
                >
                  {isApproved ? "VERIFIED GUIDE" : "VERIFICATION PENDING"}
                </Badge>
              </div>
              
              {/* Safari Information */}
              <div className="w-full md:w-3/4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Map className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Address</h3>
                      <p className="text-gray-600">{safariData.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <TentTree className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Expertise</h3>
                      <p className="text-gray-600">Wildlife Tours, Nature Trails</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Experience</h3>
                      <p className="text-gray-600">5+ years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Car className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Transportation</h3>
                      <p className="text-gray-600">4x4 Safari Vehicle Available</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600">{safariData.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-gray-200">
            {isApproved && (
              <Link href="/dashboard/safari">
                <Button className="px-6 py-2 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Go to Safari Dashboard
                </Button>
              </Link>
            )}
            
            <Link href="/">
              <Button variant="outline" className="px-6 py-2">
                Return to Homepage
              </Button>
            </Link>
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
          <CardTitle className="text-2xl font-bold">Safari Guide Registration</CardTitle>
          <CardDescription>
            Join our network of experienced safari guides or check your application status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col space-y-4 p-6 rounded-xl bg-primary/5 border border-primary/10">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-center font-medium text-lg">Already Applied?</h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;ve already submitted an application, log in to check its status
              </p>
              <Button 
                onClick={() => setIsLogin(true)}
                className="mt-auto w-full"
              >
                Login to Check Status
              </Button>
            </div>
            
            <div className="flex flex-col space-y-4 p-6 rounded-xl bg-primary/5 border border-primary/10">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-center font-medium text-lg">New Applicant?</h3>
              <p className="text-center text-sm text-gray-600">
                If you&apos;re an experienced safari guide looking to join our platform, start your application
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
          <CardTitle>Safari Guide Application Form</CardTitle>
        </div>
        <CardDescription>
          Please fill in the details below to apply as a safari guide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SafariForm />
      </CardContent>
    </Card>
  );
};