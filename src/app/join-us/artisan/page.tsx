import { ArtisanForm } from "~/components/join/artisan-form";


export default function ArtisanJoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        Enter <span className="text-secondary">Your General Information</span>
      </h3>
      <ArtisanForm/>
    </div>
  );
}
