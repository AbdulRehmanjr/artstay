"use client";


import { Button } from "~/components/ui/button";
import { useTravel } from "~/hooks/use-travel";

interface BookNowButtonProps {
  tour: TravelTourProps;
}

export const TravelBook = ({ tour }: BookNowButtonProps) => {
  const { travelPackage, setTour } = useTravel();

  const handleBookNow = () => {
    setTour(tour);
  };

  return (
    <Button 
      type="button" 
      variant={travelPackage.id === tour.tourId ? 'default' : 'outline'}
      onClick={handleBookNow}
      className="mt-4"
    >
      Book Now
    </Button>
  );
};