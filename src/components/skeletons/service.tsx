import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "~/components/ui/card";
  import { Skeleton } from "~/components/ui/skeleton";
  
  export const EventCardSkeleton = () => {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pt-8">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="mt-2 h-6 w-3/4" />
        </CardHeader>
  
        <CardContent className="space-y-4">
          {/* Description placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
  
          {/* Event details placeholder */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="pt-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </CardFooter>
      </Card>
    );
  };