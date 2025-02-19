"use client";
import { Button } from "~/components/ui/button";
import { usePackage } from "~/hooks/use-artisan-package";

type ComponentProps = {
  packageId: string;
  duration: number;
};
export const SelectPackage = ({ packageId, duration }: ComponentProps) => {
  const { artisanPackage, setPackage } = usePackage();
  return (
    <Button
      type="button"
      variant={artisanPackage.id === packageId ? "default" : "outline"}
      onClick={() => setPackage({ id: packageId, duration: duration })}
    >
      Select
    </Button>
  );
};
