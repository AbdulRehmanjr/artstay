"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { usePackage } from "~/hooks/use-artisan";

type ComponentProps = {
  packageId: string;
  duration: number;
  title: string;
  amount: number;
};

export const SelectPackage = ({
  packageId,
  duration,
  amount,
  title,
}: ComponentProps) => {
  const searchParams = useSearchParams();
  const { artisanPackage, setPackage } = usePackage();
  return (
    <Button
      type="button"
      variant={artisanPackage.id === packageId ? "default" : "outline"}
      onClick={() =>
        setPackage({
          id: packageId,
          duration: duration,
          title: title,
          amount: amount,
          artisanId: searchParams.get("artisanId") ?? "",
        })
      }
    >
      Select
    </Button>
  );
};
