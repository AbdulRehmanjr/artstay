import { type Metadata } from "next";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { RestaurantBookingForm } from "~/components/dining/booking/dining-form";
import { OrderSidebar } from "~/components/dining/booking/order-sidebar";

export const metadata: Metadata = {
  title: "Artstay | Artisan Experience Booking",
  description: "Book your artisan experience with our master craftspeople",
};

export default function BookingPage() {
  return (
    <div className="container py-10">
      <HeadlingUnderline title="Booking" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RestaurantBookingForm />
        <OrderSidebar />
      </div>
    </div>
  );
}
