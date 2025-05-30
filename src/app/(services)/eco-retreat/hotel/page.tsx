import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  Star,
  Building2,
  Users,
  Bed,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { RoomList } from "~/components/eco-retreat/room-list";

type PageProps = {
  searchParams: Promise<{ hotelId: string }>;
};

export default async function HotelPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const rooms: RoomProps[] = await api.ecoretreact.getAllRoomsByHotelId({
    hotelId: paramProps.hotelId,
  });

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-4">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-xl border-4 border-white shadow-xl">
            <Image
              src={"/placeholder.png"}
              alt="Hotel Rooms"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 flex h-[4rem] flex-col justify-end bg-gradient-to-t from-primary/90 to-transparent p-4">
              <h2 className="text-center font-heading text-sm font-bold text-white">
                Hotel Rooms
              </h2>
              <p className="text-center font-text text-xs text-white/90">
                {rooms.length} Available
              </p>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "overview", label: "Rooms Overview" },
              { id: "rooms", label: "All Rooms" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-b-none rounded-t-xl border border-border/50 bg-card/90 px-6 py-3 font-text text-base text-foreground shadow-md backdrop-blur hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Building2 className="mr-2 h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 rounded-lg bg-white/90 p-6 text-gray-900 shadow-lg backdrop-blur">
          <TabsContent value="overview" className="space-y-8">
            <HeadlingUnderline title="Rooms Overview" />

            {/* Room Stats Card */}
            <Card className="border-0 bg-primary p-8 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    {/* Average Rating */}
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <Star
                            key={index}
                            className="h-6 w-6 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                    </div>

                    <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                      <span className="font-text text-xs text-white/70">
                        Total Rooms
                      </span>
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-blue-400" />
                        <span className="font-text text-base font-medium">
                          {rooms.length} Rooms
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                      <span className="font-text text-xs text-white/70">
                        Available Now
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="font-text text-base font-medium">
                          {rooms.filter((room) => room.isActive).length}{" "}
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-text text-xs text-white/70">
                      Price Range
                    </span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="font-text text-base font-medium">
                        ${Math.min(...rooms.map((r) => r.price))} - $
                        {Math.max(...rooms.map((r) => r.price))} per night
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="font-text text-xs text-white/70">
                      Capacity Range
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <span className="font-text text-base font-medium">
                        {Math.min(...rooms.map((r) => r.capacity))} -{" "}
                        {Math.max(...rooms.map((r) => r.capacity))} Guests
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Room Types Summary */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border border-border/50 p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-primary">
                  Room Types
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-text text-foreground">
                      Different Types
                    </span>
                    <Badge className="bg-primary/10 text-primary">
                      {new Set(rooms.map((r) => r.name)).size}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="border border-border/50 p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-primary">
                  Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-text text-foreground">
                      Common Features
                    </span>
                    <Badge className="bg-primary/10 text-primary">
                      {rooms[0]?.features?.length ?? 0}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="border border-border/50 p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-primary">
                  Availability
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-text text-foreground">
                      Total Inventory
                    </span>
                    <Badge className="bg-primary/10 text-primary">
                      {rooms.reduce((sum, room) => sum + room.quantity, 0)}{" "}
                      Units
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-8">
            <HeadlingUnderline title="All Available Rooms" />
            <RoomList rooms={rooms} />
            
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
