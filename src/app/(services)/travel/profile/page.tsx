import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  Compass,
  Languages,
  Globe,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { TravelPackage } from "~/components/travel/booking/travel-package";
import { TravelCalendar } from "~/components/travel/booking/travle-calendar";


type PageProps = {
  searchParams: Promise<{ travelPlannerId: string }>;
};

export default async function TravelPlannerPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const travelPlanner = await api.travelPlanner.getTravelPlannerDetailById({
    travelPlannerId: paramProps.travelPlannerId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={travelPlanner.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
                {travelPlanner.name}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "packages", label: "Travel Tours" },
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
                    <span className="text-xs text-white/70">Price Range</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">{travelPlanner.priceRange}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Total Tours</span>
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {travelPlanner.TravelTour.length} Tours Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">Specialization</span>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">
                      {travelPlanner.speciality.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Languages</span>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {travelPlanner.language.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{travelPlanner.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Travel Planner
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {travelPlanner.description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="grid gap-6">
          <HeadlingUnderline title="Available Travel Tours" />
          {travelPlanner.TravelTour.map((tour) => (
            <TravelPackage tour={tour} key={tour.tourId} />
          ))}
        </TabsContent>

        <TabsContent value="booking" className="grid gap-8">
          <HeadlingUnderline title="Booking" />
          <TravelCalendar />
        </TabsContent>
      </div>
    </Tabs>
  );
}