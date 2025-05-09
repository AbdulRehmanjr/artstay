"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const ArtisanList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const craftFilter = searchParams.get("craft");
  const subCraftFilter = searchParams.get("subCraft");
  // const ratingFilter = searchParams.get("rating")?.split(",").map(Number) ?? [];
  const educationFilter = searchParams.get("education");
  const trainingFilter = searchParams.get("training");
  const certificationFilter = searchParams.get("certification");
  const recognitionFilter = searchParams.get("recognition");
  const locationFilter = searchParams.get("location");
  const expertiseFilter = useMemo(() => searchParams.get("expertise")?.split(",") ?? [], [searchParams]);

  const [artisans] = api.artisan.getAllArtisans.useSuspenseQuery();

const filteredArtisans = useMemo(() => {
  return artisans.filter(artisan => {
    // Apply craft filter
    if (craftFilter && artisan.craft?.craftId?.toString() !== craftFilter) {
      return false;
    }
    
    // Apply subCraft filter
    if (subCraftFilter && artisan.subCraft?.subCraftId?.toString() !== subCraftFilter) {
      return false;
    }
    
    // Apply expertise filter (case-insensitive comparison)
    if (expertiseFilter.length > 0 && 
        !expertiseFilter.some(exp => exp.toUpperCase() === artisan.experience.toUpperCase())) {
      return false;
    }
    
    // Apply education filter (case-insensitive)
    if (educationFilter && 
        artisan.education.toUpperCase() !== educationFilter.toUpperCase()) {
      return false;
    }
    
    // Apply training filter (case-insensitive)
    if (trainingFilter && 
        artisan.training.toUpperCase() !== trainingFilter.toUpperCase()) {
      return false;
    }
    
    // Apply certification filter (case-insensitive)
    if (certificationFilter && 
        artisan.certificate.toUpperCase() !== certificationFilter.toUpperCase()) {
      return false;
    }
    
    // Apply recognition filter (note the correct property name)
    if (recognitionFilter && 
        artisan.recongnition.toUpperCase() !== recognitionFilter.toUpperCase()) {
      return false;
    }
    
    
    // Apply location filter
    if (locationFilter && artisan.address !== locationFilter) {
      return false;
    }
    
    // If passed all filters
    return true;
  });
}, [artisans, craftFilter, subCraftFilter, expertiseFilter, educationFilter, trainingFilter, certificationFilter, recognitionFilter, locationFilter]);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {filteredArtisans.length > 0 ? (
        filteredArtisans.map((artisan, index) => (
          <div
            key={artisan.artisanId ?? index}
            className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl"
            onClick={() =>
              router.push(`artisan/profile?artisanId=${artisan.artisanId}`)
            }
          >
            {/* Image Container with Overlay */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={artisan.dp == "" ? "/placeholder.png" : artisan.dp}
                alt={`${artisan.firstName} ${artisan.lastName}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content Container */}
            <div className="relative p-6">
              {/* Expertise Badge */}
              <Badge className="absolute right-6">{artisan.experience}</Badge>

              {/* Name and Description */}
              <h3 className="max-w-[8rem] text-wrap text-lg font-semibold tracking-tight text-gray-900">
                {artisan.firstName} {artisan.lastName}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {artisan.description}
              </p>

              {/* Divider */}
              <div className="my-4 h-px w-full bg-gray-100" />

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="line-clamp-1">{artisan.address}</p>
                </div>

                {/* Craft and SubCraft with Icons */}
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">
                      {artisan.craft.craftName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {artisan.subCraft.subCraftName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No artisans found</h3>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};