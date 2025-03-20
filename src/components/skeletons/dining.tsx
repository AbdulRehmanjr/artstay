import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const RestaurantListSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <>
      {/* Restaurant grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(count).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden bg-white">
            {/* Image skeleton */}
            <Skeleton className="h-48 w-full" />
            
            {/* Price badge skeleton */}
            <div className="absolute bottom-3 right-3">
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>

            <CardContent className="p-4">
              {/* Title and date */}
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              
              {/* Description */}
              <Skeleton className="mb-3 h-10 w-full" />
              
              {/* Cuisine tags */}
              <div className="mb-3 flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              {/* Location */}
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export const RestaurantCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white">
      <Skeleton className="h-48 w-full" />
      
      {/* Price badge skeleton */}
      <div className="absolute bottom-3 right-3">
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>

      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        
        <Skeleton className="mb-3 h-10 w-full" />
        
        <div className="mb-3 flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
};