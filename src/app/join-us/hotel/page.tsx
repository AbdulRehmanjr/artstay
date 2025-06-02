import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { Languages, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HotelRegistrationStatus } from "~/components/join/hotel/application-status";

export default function LanguageServiceJoinPage() {
  return (
    <HydrateClient>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <Link
            href="/join-us"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Join Us
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Languages className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                Hotel Service Registration
              </h1>
              <p className="text-gray-600">Join our network of hotel booking</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Hotel Service Provider Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your details to become a verified hotel service provider
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <HotelRegistrationStatus />
          </Suspense>
        </div>

        {/* Additional Information */}
        <div className="rounded-xl bg-primary/5 p-6">
          <h3 className="mb-4 font-heading text-lg font-semibold text-primary">
            What to Expect
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>Your profile will be reviewed within 48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Upon approval, you&apos;ll receive access to our hotel service provider dashboard
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Connect with clients seeking bookings
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Access to our booking management system and client communication tools
              </span>
            </li>
          </ul>
        </div>
      </div>
    </HydrateClient>
  );
}