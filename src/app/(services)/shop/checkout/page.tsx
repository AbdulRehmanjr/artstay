import { type Metadata } from "next";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { ShopCheckoutForm } from "~/components/shop/shop-form";

export const metadata: Metadata = {
  title: "Artstay | Checkout",
  description: "Complete your purchase of authentic Kashmiri handicrafts",
};

export default function ShopCheckoutPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Checkout" />
      <ShopCheckoutForm />
    </div>
  );
}
