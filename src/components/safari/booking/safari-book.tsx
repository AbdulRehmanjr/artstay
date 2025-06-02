"use client";

import { useSafari } from "~/hooks/use-safari";
import { Button } from "~/components/ui/button";

interface BookNowButtonProps {
  tour: SafariTourProps;
}

export const SafariBook = ({ tour }: BookNowButtonProps) => {
  const { safariPackage,setTour } = useSafari();

  const handleBookNow = () => {
    setTour(tour);
  };

  return <Button 
  type="button" 
  variant={safariPackage.id == tour.tourId ? 'default':'outline'}
  onClick={handleBookNow}

  >Book Now</Button>;
};
