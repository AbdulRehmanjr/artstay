import Link from "next/link";
import { Button } from "~/components/ui/button";
import { JoinCard } from "~/constants/card";

export default function JoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        What <span className="text-secondary">Describes</span> You The Best?
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {JoinCard.map((card, index) => (
          <div
            className="group relative col-span-3 grid cursor-pointer place-content-center place-items-center gap-4 overflow-hidden rounded-lg border p-4 xl:col-span-1"
            key={index}
          >
            <div className="absolute left-0 top-0 z-[-1] h-full w-0 bg-primary/50 transition-all duration-1000 ease-in-out group-hover:w-full" />
            <div className="absolute right-0 top-0 z-[-2] h-full w-0 bg-primary/50 transition-all duration-1000 ease-in-out group-hover:w-full" />
            <h4 className="duration-800 max-w-[13rem] text-center font-heading text-xl font-extrabold text-primary transition-colors group-hover:text-white">
              {card.title}
            </h4>
            <p className="duration-800 max-w-xs text-center font-text transition-colors group-hover:text-white">
              {card.description}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                asChild
                className="duration-650 transition-colors"
              >
                <Link href={card.link}>Join</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
