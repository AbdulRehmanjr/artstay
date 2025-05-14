"use client";

import { useFairEvent } from "~/hooks/use-fair";
import { Button } from "~/components/ui/button";

interface FairEventBookProps {
  event: FairEventProps;
}

export const FairEventBook = ({ event }: FairEventBookProps) => {
  const { setEvent } = useFairEvent();

  const handleRegisterNow = () => {
    // Save the selected event in the store
    setEvent(event);
  };

  return (
    <Button
      className="w-full rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
      onClick={handleRegisterNow}
    >
      Register Now
    </Button>
  );
};
