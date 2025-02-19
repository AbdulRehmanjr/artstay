import { SafariForm } from "~/components/join/safari-form";


export default function SafariJoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        Enter <span className="text-secondary">Your General Information</span>
      </h3>
      <SafariForm/>
    </div>
  );
}
