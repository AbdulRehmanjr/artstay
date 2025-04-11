import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import {  ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { SafariRegistrationStatus } from "~/components/join/safari/safari-application";

export const dynamic = 'force-dynamic'

export default function SafariJoinPage() {
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
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                Safari Guide Registration
              </h1>
              <p className="text-gray-600">
                Join our community of expert safari guides in Kashmir
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Your Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your details to help us understand your expertise and experience
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <SafariRegistrationStatus />
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
                Upon approval, you&apos;ll receive access to our safari guide dashboard
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                You&apos;ll be able to create and manage tour packages and experiences
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Regular training sessions on wildlife conservation and sustainable tourism
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Access to a network of local hospitality partners and resources
              </span>
            </li>
          </ul>
        </div>
      </div>
    </HydrateClient>
  );
}