"use client";

import { Button } from "~/components/ui/button";
import { useDocumentorBooking } from "~/hooks/use-document";

interface DocumentorPackageBookProps {
  package: DocumentorPackageProps;
}

export const DocumentorPackageBook = ({ package: pkg }: DocumentorPackageBookProps) => {
  const { setPackage } = useDocumentorBooking();

  const handleBookNow = () => {
    // Save the selected package in the store
    setPackage(pkg);
  };

  return (
    <Button
      className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
      onClick={handleBookNow}
    >
      Book Now
    </Button>
  );
};