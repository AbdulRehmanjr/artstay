import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { Store, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ShopRegistrationStatus } from "~/components/join/shop/application-status";

export default function ShopJoinPage() {
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
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                Shop Registration
              </h1>
              <p className="text-gray-600">Join our marketplace as a vendor</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Shop Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your shop details to join our marketplace
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <ShopRegistrationStatus />
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
              <span>Your shop application will be reviewed within 48-72 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Upon approval, you&apos;ll receive access to our vendor dashboard
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                We&apos;ll help you list your products and manage your inventory
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <span>
                Access to our marketing tools and customer analytics
              </span>
            </li>
          </ul>
        </div>
      </div>
    </HydrateClient>
  );
}