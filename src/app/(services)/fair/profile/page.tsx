import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  Badge,
  Binoculars,
  Calendar,
  CheckCircle2,
  Compass,
  Languages,
  Building,
  Map,
} from "lucide-react";
import { ArtisanCalendar } from "~/components/artisans/artisan-calendar";
import { HeadlingUnderline } from "~/components/common/heading-underline";


type PageProps = {
  searchParams: Promise<{ fairId: string }>;
};

export default async function FairPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const fair: FairDetailProps = await api.fair.getFairDetail({
    fairId: paramProps.fairId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={fair.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-3xl font-semibold text-white">
                {fair.firstName} {fair.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "events", label: "Fair Events" },
              { id: "booking", label: "Booking" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <span className="mr-2">+</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white/90 p-6 text-gray-900 shadow-lg backdrop-blur">
        <TabsContent value="general" className="grid gap-6">
          <HeadlingUnderline title="General Information" />
          <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Star Rating */}
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className={`h-6 w-6 transition-colors duration-200 ${
                            index < 5
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Experience</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">10+ Years</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Total Events</span>
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {fair.FairEvent.length} Events Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">Specialization</span>
                  <div className="flex items-center gap-2">
                    <Binoculars className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">Fair Management</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Languages</span>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">English, Hindi</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{fair.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Fair Organizer
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {fair.description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="events" className="grid gap-6">
          <HeadlingUnderline title="Available Fair Events" />
          {fair.FairEvent.map((event) => (
            <div
              key={event.eventId}
              className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-secondary">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-text">{event.organizer}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6">{event.description}</p>

                  <div className="grid gap-4">
                    <p className="font-heading text-secondary text-lg">Event Details </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-gray-600">Location: {event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-gray-600">Venue: {event.vanue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-gray-600">
                        Coordinates: {event.latitude}, {event.longitude}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-gray-600">Fair Type: {event.fairType}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Created: {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Updated: {new Date(event.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="booking" className="grid gap-8">
          <HeadlingUnderline title="Booking" />
          <ArtisanCalendar />
        </TabsContent>
      </div>
    </Tabs>
  );
}