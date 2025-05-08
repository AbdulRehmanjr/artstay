import { Skeleton } from "~/components/ui/skeleton";

export const ServiceListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl bg-white shadow-md"
        >
          {/* Image Skeleton */}
          <div className="relative h-64 w-full overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Container */}
          <div className="relative p-6">
            {/* Expertise Badge Skeleton */}
            <div className="absolute right-6">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Name Skeleton */}
            <Skeleton className="mb-2 h-6 w-32" />

            {/* Description Skeleton */}
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Divider */}
            <div className="my-4 h-px w-full bg-gray-100" />

            {/* Details Skeletons */}
            <div className="space-y-4 text-sm">
              {/* Location */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Craft and SubCraft */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex w-full items-center gap-1">
                  <Skeleton className="h-4 w-1/3" />
                  <div className="text-gray-400">•</div>
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
