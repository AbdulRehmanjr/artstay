import { type Metadata } from "next";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { TravelBookingForm } from "~/components/travel/booking/travel-form"

export const metadata: Metadata = {
  title: "Artstay | Travel Booking",
  description:
    "Book your travel adventure with local guides. Experience personalized tours, cultural experiences, and amazing destinations with our expert travel planners.",
};

export default function TravelBookingPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Travel Booking" />
      <TravelBookingForm />
    </div>
  );
}