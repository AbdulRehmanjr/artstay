"use client";

import { Button } from "~/components/ui/button";
import { useLanguageService } from "~/hooks/use-language";

interface LanguageServiceBookProps {
  service: LanguageServiceProps;
}

export const LanguageServiceBook = ({ service }: LanguageServiceBookProps) => {
  const { setService } = useLanguageService();

  const handleBookNow = () => {
    // Save the selected service in the store
    setService(service);
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