import { type Metadata } from "next";
import { ArtisanBookingForm } from "~/components/artisans/artisan-booking";
import { HeadlingUnderline } from "~/components/common/heading-underline";

export const metadata: Metadata = {
  title: "Artstay | Artisan Experience Booking",
  description: "Book your artisan experience with our master craftspeople",
};

export default function BookingPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Booking" />
      <ArtisanBookingForm />
    </div>
  );
}
