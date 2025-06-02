import { type Metadata } from "next";
import { RoomInput } from "~/components/eco-retreat/booking/room-input";

export const metadata: Metadata = {
  title: "ARTSAY | Room booking",
};

type PageProps = {
  searchParams: Promise<{ hotelId: string }>;
};

export default async function BookingPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  return (
    <>
      <RoomInput />
      {/* <RoomCalendar /> */}
    </>
  );
}
