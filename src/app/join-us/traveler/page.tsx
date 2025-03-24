import { TravelerForm } from "~/components/join/traveler-form";

export default function TravelerJoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        Enter <span className="text-secondary">Your General Information</span>
      </h3>
      <TravelerForm/>
    </div>
  );
}
