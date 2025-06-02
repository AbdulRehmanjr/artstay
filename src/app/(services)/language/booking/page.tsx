import { type Metadata } from "next";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { LanguageServiceBookingForm } from "~/components/language/booking/language-booking";

export const metadata: Metadata = {
  title: "Artstay | Language",
  description:
    "Discover authentic Kashmir experiences with local guides. Book cultural tours, wildlife safaris, and immersive travel packages in the heart of Kashmir valley.",
};

export default function BookingPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Booking" />
      <LanguageServiceBookingForm />
    </div>
  );
}
