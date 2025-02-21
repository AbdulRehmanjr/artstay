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
} from "lucide-react";
import { ArtisanCalendar } from "~/components/artisans/artisan-calendar";
import { HeadlingUnderline } from "~/components/common/heading-underline";

type PageProps = {
  searchParams: Promise<{ safariId: string }>;
};

export default async function SafariPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const safari: SafariDetailProps = await api.safari.getSafariDetail({
    safariId: paramProps.safariId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={safari.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-[#9a5d33] to-transparent p-4">
              <h2 className="text-center text-3xl font-semibold text-white">
                {safari.firstName} {safari.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "packages", label: "Safari Tours" },
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
                    <span className="text-xs text-white/70">Total Tours</span>
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {safari.SafariTour.length} Tours Available
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
                    <span className="text-base font-medium">Wildlife Photography</span>
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
                  <span className="text-base">{safari.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Safari Guide
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {safari.description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="grid gap-6">
          <HeadlingUnderline title="Available Safari Tours" />
          {safari.SafariTour.map((tour) => (
            <div
              key={tour.tourId}
              className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {tour.title}
                      </h3>
                      <p className="text-sm text-gray-500">{tour.operator}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary">
                      {tour.duration}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6">{tour.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    {tour.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-xl font-semibold text-primary">
                        ${tour.fee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Updated: {new Date(tour.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    Book Now
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