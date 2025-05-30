import {
  Bed,
  Badge,
  Users,
  Maximize,
  Calendar,
  Armchair,
  Bath,
  Briefcase,
  Building2,
  Car,
  CheckCircle,
  ChefHat,
  Coffee,
  Eye,
  Flame,
  Mountain,
  Refrigerator,
  Shield,
  Trees,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

type ComponentProps = {
  rooms: RoomProps[];
};

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

export const RoomList = ({ rooms }: ComponentProps) => {
  return (
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
                {room.images && room.images.length > 0 ? (
                  <div className="relative h-64 w-full lg:h-80">
                    <Carousel className="h-64 w-full lg:h-80">
                      <CarouselContent className="ml-0 h-64 lg:h-80">
                        {room.images.map((image, index) => (
                          <CarouselItem
                            key={index}
                            className="h-64 pl-0 lg:h-80"
                          >
                            <div className="relative h-64 w-full lg:h-80">
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
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center bg-gray-100 lg:h-80">
                    <Bed className="h-12 w-12 text-gray-400" />
                  </div>
                )}
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
                <Button asChild>
                  <Link href={`/eco-retreat/room?roomId=${room.roomId}`}>
                    Book Now
                  </Link>
                </Button>
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
            This hotel currently has no rooms listed. Please check back later.
          </p>
        </Card>
      )}
    </div>
  );
};
