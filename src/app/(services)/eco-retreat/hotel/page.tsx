import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  Star,
  Building2,
  Users,
  Calendar,
  Bed,
  Maximize,
  DollarSign,
  CheckCircle,
  Wifi,
  Car,
  Coffee,
  Bath,
  Tv,
  Wind,
  Shield,
  Mountain,
  Eye,
  Trees,
  Waves,
  UtensilsCrossed,
  ChefHat,
  Zap,
  Briefcase,
  Armchair,
  Flame,
  Refrigerator,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

type RoomProps = {
  roomId: string;
  code: string;
  name: string;
  capacity: number;
  area: number;
  features: string[];
  description: string;
  dp: string;
  beds: number;
  quantity: number;
  price: number;
  isActive: boolean;
  minimumstay: number;
  images: string[];
  hotelId: string;
};

type PageProps = {
  searchParams: Promise<{ hotelId: string }>;
};

export default async function HotelPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const rooms: RoomProps[] = await api.ecoretreact.getAllRoomsByHotelId({
    hotelId: paramProps.hotelId,
  });

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();

    // Exact matches for common features
    switch (feature) {
      case "Air Conditioning":
        return <Wind className="h-4 w-4" />;
      case "Free WiFi":
        return <Wifi className="h-4 w-4" />;
      case "Private Bathroom":
        return <Bath className="h-4 w-4" />;
      case "TV":
        return <Tv className="h-4 w-4" />;
      case "Mini Fridge":
        return <Refrigerator className="h-4 w-4" />;
      case "Safe":
        return <Shield className="h-4 w-4" />;
      case "Balcony":
        return <Mountain className="h-4 w-4" />;
      case "Sea View":
        return <Waves className="h-4 w-4" />;
      case "City View":
        return <Building2 className="h-4 w-4" />;
      case "Garden View":
        return <Trees className="h-4 w-4" />;
      case "Pool View":
        return <Waves className="h-4 w-4" />;
      case "Room Service":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "Kitchenette":
        return <ChefHat className="h-4 w-4" />;
      case "Coffee/Tea Maker":
        return <Coffee className="h-4 w-4" />;
      case "Hair Dryer":
        return <Zap className="h-4 w-4" />;
      case "Iron & Ironing Board":
        return <Zap className="h-4 w-4" />;
      case "Work Desk":
        return <Briefcase className="h-4 w-4" />;
      case "Sofa":
        return <Armchair className="h-4 w-4" />;
      case "Jacuzzi":
        return <Bath className="h-4 w-4" />;
      case "Fireplace":
        return <Flame className="h-4 w-4" />;
      default:
        // Fallback for partial matches
        if (lowerFeature.includes("wifi") || lowerFeature.includes("internet"))
          return <Wifi className="h-4 w-4" />;
        if (lowerFeature.includes("parking") || lowerFeature.includes("car"))
          return <Car className="h-4 w-4" />;
        if (lowerFeature.includes("coffee") || lowerFeature.includes("tea"))
          return <Coffee className="h-4 w-4" />;
        if (lowerFeature.includes("bath") || lowerFeature.includes("shower"))
          return <Bath className="h-4 w-4" />;
        if (lowerFeature.includes("tv") || lowerFeature.includes("television"))
          return <Tv className="h-4 w-4" />;
        if (lowerFeature.includes("ac") || lowerFeature.includes("air"))
          return <Wind className="h-4 w-4" />;
        if (lowerFeature.includes("view")) return <Eye className="h-4 w-4" />;
        if (lowerFeature.includes("safe") || lowerFeature.includes("security"))
          return <Shield className="h-4 w-4" />;
        if (lowerFeature.includes("kitchen"))
          return <ChefHat className="h-4 w-4" />;
        if (lowerFeature.includes("desk") || lowerFeature.includes("work"))
          return <Briefcase className="h-4 w-4" />;
        if (lowerFeature.includes("sofa") || lowerFeature.includes("chair"))
          return <Armchair className="h-4 w-4" />;
        if (
          lowerFeature.includes("fridge") ||
          lowerFeature.includes("refrigerator")
        )
          return <Refrigerator className="h-4 w-4" />;
        return <CheckCircle className="h-4 w-4" />;
    }
  };

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

            <div className="space-y-6">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <Card
                    key={room.roomId}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Room Images */}
                      <div className="lg:w-1/3">
                        <div className="relative h-64 w-full lg:h-full">
                          {room.images && room.images.length > 0 ? (
                            <Carousel className="h-full w-full">
                              <CarouselContent className="h-full">
                                {room.images.map((image, index) => (
                                  <CarouselItem key={index} className="h-full w-full">
                                    <div className="relative h-64 w-full lg:h-full">
                                      <Image
                                        src={image || "/placeholder.png"}
                                        alt={`${room.name} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              {room.images.length > 1 && (
                                <>
                                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                                </>
                              )}
                            </Carousel>
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-100">
                              <Bed className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Room Details */}
                      <div className="flex-1 p-6 lg:p-8">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="mb-2 font-heading text-2xl font-bold text-primary">
                              {room.name}
                            </h3>
                            <div className="mb-3 flex items-center gap-4">
                              <Badge className="bg-primary/10 font-text text-primary hover:bg-primary/20">
                                {room.code}
                              </Badge>
                              <Badge
                                className={`font-text ${room.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {room.isActive ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-heading text-3xl font-bold text-primary">
                              ${room.price}
                            </div>
                            <span className="font-text text-sm text-gray-600">
                              per night
                            </span>
                          </div>
                        </div>

                        {/* Room Stats */}
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-text text-sm text-gray-600">
                                Capacity
                              </div>
                              <div className="font-text font-semibold text-gray-900">
                                {room.capacity} Guests
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                            <Bed className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-text text-sm text-gray-600">
                                Beds
                              </div>
                              <div className="font-text font-semibold text-gray-900">
                                {room.beds} Beds
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                            <Maximize className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-text text-sm text-gray-600">
                                Area
                              </div>
                              <div className="font-text font-semibold text-gray-900">
                                {room.area} sq ft
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-text text-sm text-gray-600">
                                Min Stay
                              </div>
                              <div className="font-text font-semibold text-gray-900">
                                {room.minimumstay} Nights
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mb-6 font-text leading-relaxed text-gray-600">
                          {room.description}
                        </p>

                        {/* Features */}
                        <div className="mb-6">
                          <h4 className="mb-3 font-heading font-semibold text-gray-900">
                            Room Features
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {room.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary"
                              >
                                {getFeatureIcon(feature)}
                                <span className="font-text text-sm font-medium">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-text text-sm">
                              Available Rooms: {room.quantity}
                            </span>
                          </div>
                          <Button className="bg-primary px-8 font-text text-white hover:bg-primary/90">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <Bed className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">
                    No Rooms Available
                  </h3>
                  <p className="font-text text-gray-600">
                    This hotel currently has no rooms listed. Please check back
                    later.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
