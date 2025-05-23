"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  MapPin,
  FileText,
  Users,
  Package,
  Star,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";

export const DocumentorList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const searchFilter = searchParams.get("search");
  const specializationFilter = searchParams.get("specialization");
  const craftFocusAreaFilter = searchParams.get("craftFocusArea");
  const languageFilter = searchParams.get("language");
  const packageTypeFilter = searchParams.get("packageType");
  const priceRangeFilter = searchParams.get("priceRange");
  const isAvailableFilter = searchParams.get("isAvailable") === "true";
  const isVerifiedFilter = searchParams.get("isVerified") === "true";

  const [documentors] = api.documentor.getAllDocumentors.useSuspenseQuery();

  const filteredDocumentors = useMemo(() => {
    if (
      !searchFilter &&
      !specializationFilter &&
      !craftFocusAreaFilter &&
      !languageFilter &&
      !packageTypeFilter &&
      !priceRangeFilter &&
      !isAvailableFilter &&
      !isVerifiedFilter
    ) {
      return documentors;
    }

    return documentors.filter((documentor) => {
      // Search filter
      if (
        searchFilter &&
        !(
          documentor.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          documentor.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          documentor.description.toLowerCase().includes(searchFilter.toLowerCase())
        )
      ) {
        return false;
      }

      // Specialization filter
      if (specializationFilter && !documentor.specialization.includes(specializationFilter)) {
        return false;
      }

      // Craft focus area filter
      if (craftFocusAreaFilter && !documentor.craftFocusAreas.includes(craftFocusAreaFilter)) {
        return false;
      }

      // Language filter
      if (languageFilter && !documentor.languages.includes(languageFilter)) {
        return false;
      }

      // Active status filter (for availability)
      if (isAvailableFilter && !documentor.isActive) {
        return false;
      }

      // Note: packageType and priceRange filters would require additional DocumentorPackage data
      // These would be implemented if package data is included in the API response

      return true;
    });
  }, [searchFilter, specializationFilter, craftFocusAreaFilter, languageFilter, packageTypeFilter, priceRangeFilter, isAvailableFilter, isVerifiedFilter, documentors]);

  return (
    <div className="px-4 py-8">
      {/* Active Filters Display */}
      {((searchFilter ?? false) || (specializationFilter ?? false) || (craftFocusAreaFilter ?? false) || (languageFilter ?? false) || isAvailableFilter) && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm font-medium">Active filters:</span>
          {searchFilter && (
            <Badge variant="secondary">Search: {searchFilter}</Badge>
          )}
          {specializationFilter && (
            <Badge variant="secondary">Specialization: {specializationFilter}</Badge>
          )}
          {craftFocusAreaFilter && (
            <Badge variant="secondary">Focus Area: {craftFocusAreaFilter}</Badge>
          )}
          {languageFilter && (
            <Badge variant="secondary">Language: {languageFilter}</Badge>
          )}
          {isAvailableFilter && (
            <Badge variant="secondary">Available Now</Badge>
          )}
        </div>
      )}

      {/* Documentor Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDocumentors.map((documentor, index) => (
          <Card
            key={documentor.documentorId ?? index}
            className="group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
            onClick={() => router.push(`/documentary/profile?documentorId=${documentor.documentorId}`)}
          >
            <div className="relative">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={documentor.dp || '/placeholder.png'}
                  alt={`${documentor.firstName} ${documentor.lastName}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              <div className="absolute bottom-3 right-3">
                <Badge variant="outline" className="bg-white/90 font-mono text-gray-800">
                  <Clock className="mr-1 h-3 w-3" />
                  {documentor.yearsExperience}y
                </Badge>
              </div>

              {documentor.isActive && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500">Available</Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {documentor.firstName} {documentor.lastName}
                </h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {dayjs(documentor.createdAt).format('MMM YYYY')}
                </Badge>
              </div>
              
              <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                {documentor.description}
              </p>
              
              {/* Specializations */}
              <div className="mb-3 flex flex-wrap gap-1">
                {documentor.specialization?.slice(0, 2).map((spec, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <FileText className="mr-1 h-3 w-3" />
                    {spec}
                  </Badge>
                ))}
                {documentor.specialization?.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{documentor.specialization.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Craft Focus Areas */}
              <div className="mb-3 flex flex-wrap gap-1">
                {documentor.craftFocusAreas?.slice(0, 2).map((area, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    <Star className="mr-1 h-3 w-3" />
                    {area}
                  </Badge>
                ))}
                {documentor.craftFocusAreas?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{documentor.craftFocusAreas.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Languages */}
              <div className="mb-3 flex flex-wrap gap-1">
                {documentor.languages?.slice(0, 3).map((lang, i) => (
                  <Badge key={i} className="bg-blue-100 text-blue-800 text-xs">
                    <Users className="mr-1 h-3 w-3" />
                    {lang}
                  </Badge>
                ))}
                {documentor.languages?.length > 3 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    +{documentor.languages.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{documentor.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* No Results Message */}
      {filteredDocumentors.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No documentors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};