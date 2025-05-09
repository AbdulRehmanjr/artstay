"use client";

import { useSafariPackage } from "~/hooks/use-safari";
import { Button } from "~/components/ui/button";


interface BookNowButtonProps {
  tour: SafariTourProps;
  onSuccess?: () => void;
}

export const SafariBook = ({ tour, onSuccess }: BookNowButtonProps) => {
  const { setTour } = useSafariPackage();

  const handleBookNow = () => {
    setTour(tour);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Button 
      className="w-full rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
      onClick={handleBookNow}
    >
      Book Now
    </Button>
  );
};