import { FairForm } from "~/components/join/fair-form";

export default function FairJoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        Enter <span className="text-secondary">Your General Information</span>
      </h3>
      <FairForm/>
    </div>
  );
}
