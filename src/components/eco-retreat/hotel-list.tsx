"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { MapPin, Phone, Mail, Calendar, Building2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export const HotelList = () => {
  const [hotels] = api.ecoretreact.getAllHotels.useSuspenseQuery();

  return (
    <div className="mx-auto max-w-7xl px-2 py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <Card
              key={hotel.hotelId}
              className="group cursor-pointer overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/20"
            >
              <div className="relative">
                {/* Status Badge */}
                <Badge
                  className="absolute left-3 top-3 z-10 font-text text-xs shadow-md"
                  variant={hotel.isActive ? "default" : "destructive"}
                >
                  {hotel.isActive ? "Available" : "Unavailable"}
                </Badge>

                {/* Premium Badge */}
                <Badge className="absolute right-3 top-3 z-10 bg-primary/90 font-text text-xs text-white shadow-md hover:bg-primary">
                  Premium
                </Badge>

                {/* Image Carousel */}
                <div className="relative h-56 overflow-hidden">
                  {hotel.images && hotel.images.length > 0 ? (
                    <Carousel className="h-full w-full">
                      <CarouselContent>
                        {hotel.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-56">
                              <Image
                                src={image || "/placeholder.png"}
                                alt={`${hotel.name} - Image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {hotel.images.length > 1 && (
                        <>
                          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 border-0 bg-white/90 shadow-lg hover:bg-white" />
                          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-white/90 shadow-lg hover:bg-white" />
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <div className="relative flex h-56 items-center justify-center bg-muted/50">
                      <Building2 className="h-12 w-12 text-muted-foreground/50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                  )}
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-5">
                {/* Hotel Name & Code */}
                <h3 className="line-clamp-1 font-heading text-lg font-bold text-primary transition-colors group-hover:text-primary/80">
                  {hotel.name}
                </h3>

                {/* Manager Info */}
                <div className="mb-3">
                  <p className="font-text text-sm font-medium text-foreground/80">
                    Manager:{" "}
                    <span className="text-primary">
                      {hotel.firstName} {hotel.lastName}
                    </span>
                  </p>
                </div>

                {/* Description with proper truncation */}
                <div className="mb-4">
                  <p className="overflow-hidden truncate font-text text-sm leading-relaxed text-muted-foreground">
                    {hotel.description}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-4 flex items-start text-muted-foreground">
                  <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="line-clamp-2 font-text text-sm">
                    {hotel.address}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="font-text text-sm">{hotel.phone}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="truncate font-text text-sm">
                      {hotel.email}
                    </span>
                  </div>
                </div>

                {/* Check-in/Check-out Times */}
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-primary">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span className="font-text font-medium">
                        In: {hotel.checkIn}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-primary/20"></div>
                    <div className="flex items-center text-primary">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span className="font-text font-medium">
                        Out: {hotel.checkOut}
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="my-2 w-full" asChild>
                  <Link href={`/eco-retreat/hotel?hotelId=${hotel.hotelId}`}>
                    Detail
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-primary">
                No Hotels Available
              </h3>
              <p className="mb-6 font-text text-muted-foreground">
                We couldn&apos;t find any hotels at the moment. Please check
                back later or contact support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
