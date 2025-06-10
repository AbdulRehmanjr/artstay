import { type Metadata } from "next";
import { Suspense } from "react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { RoomBookingForm } from "~/components/eco-retreat/booking/booking-form";

export const metadata: Metadata = {
  title: "Artstay | Room Booking",
  description:
    "Complete your room reservation with Artstay. Book authentic Kashmir accommodations with local hospitality. Secure booking process for hotels, guesthouses, and traditional stays in Kashmir valley.",
};

export default function BookingPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Booking" />
      <Suspense>
        <RoomBookingForm />
      </Suspense>
    </div>
  );
}
