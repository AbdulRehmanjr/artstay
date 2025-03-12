import { ShopCreationForm } from "~/components/join/shop-form";

export default function ShopJoinPage() {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-3xl">
        Enter <span className="text-secondary">Your General Information</span>
      </h3>
      <ShopCreationForm/>
    </div>
  );
}
