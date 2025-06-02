"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card } from "~/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Button } from "~/components/ui/button";

export const LanguageList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract filter values from search params
  const searchFilter = searchParams.get("search");
  const locationFilter = searchParams.get("location");
  const languageFilters = searchParams.getAll("language");
  const specializationFilters = searchParams.getAll("specialization");
  const ratingFilters =
    searchParams.get("rating")?.split(",").map(Number) ?? [];
  const minRateFilter = searchParams.get("minRate");
  const maxRateFilter = searchParams.get("maxRate");
  const availabilityFilters = searchParams.getAll("availability");

  const [languageList] = api.language.getAll.useSuspenseQuery();

  // Apply filters to services
  const filteredServices =
    languageList.filter((service) => {
      // Apply search filter if specified
      if (
        searchFilter &&
        !service.description
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) &&
        !service.firstName.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !service.lastName.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !service.profileName.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return false;
      }

      // Apply location filter if specified
      if (
        locationFilter &&
        !service.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false;
      }

      // Apply language filter if specified
      if (
        languageFilters.length > 0 &&
        !languageFilters.some((filter) =>
          service.languages.some((lang) =>
            lang.toLowerCase().includes(filter.toLowerCase()),
          ),
        )
      ) {
        return false;
      }

      // Apply specialization filter if specified
      if (
        specializationFilters.length > 0 &&
        !specializationFilters.some((filter) =>
          service.specialization.some((spec) =>
            spec.toLowerCase().includes(filter.toLowerCase()),
          ),
        )
      ) {
        return false;
      }

      // Apply rating filter if specified
      if (
        ratingFilters.length > 0 &&
        !ratingFilters.includes(Math.floor(service.rating))
      ) {
        return false;
      }

      // Apply hourly rate filters if specified
      if (minRateFilter && service.hourlyRate < parseFloat(minRateFilter)) {
        return false;
      }

      if (maxRateFilter && service.hourlyRate > parseFloat(maxRateFilter)) {
        return false;
      }

      // Apply availability filter if specified
      if (
        availabilityFilters.length > 0 &&
        !availabilityFilters.some((day) => service.availability.includes(day))
      ) {
        return false;
      }

      return true;
    }) ?? [];

  // Check if any filters are applied
  const hasActiveFilters =
    (searchFilter ?? false) ||
    (locationFilter ?? false) ||
    languageFilters.length > 0 ||
    specializationFilters.length > 0 ||
    ratingFilters.length > 0 ||
    (minRateFilter ?? false) ||
    (maxRateFilter ?? false) ||
    availabilityFilters.length > 0;

  return (
    <div className="space-y-6">
      <div className="my-2 flex items-center">
        {hasActiveFilters && (
          <Button variant="outline" onClick={() => router.push(pathname)}>
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <Card
              key={service.languageServiceId ?? index}
              className="cursor-pointer overflow-hidden bg-white transition-shadow duration-300 hover:shadow-md"
              onClick={() =>
                router.push(
                  `/language/profile?serviceId=${service.languageServiceId}`,
                )
              }
            >
              <div className="relative">
                {service.rating >= 4.5 && (
                  <Badge className="absolute left-4 top-4 z-10">
                    Top Rated
                  </Badge>
                )}

                <div className="relative h-72">
                  <Image
                    src={service.profileImage || "/placeholder.png"}
                    alt={`${service.firstName} ${service.lastName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-secondary">
                  {service.firstName} {service.lastName}
                </h3>

                <div className="mt-1 flex items-center">
                  {[...Array<number>(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    ({service.rating.toFixed(1)})
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {service.languages.slice(0, 3).map((language, i) => (
                    <Badge key={i} variant="outline" className="bg-secondary/5">
                      {language}
                    </Badge>
                  ))}
                  {service.languages.length > 3 && (
                    <Badge variant="outline" className="bg-secondary/5">
                      +{service.languages.length - 3}
                    </Badge>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">{service.location}</span>
                  </div>
                  <span className="font-semibold text-primary">
                    ${service.hourlyRate}/hr
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No language services found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters to see more results.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(pathname)}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
