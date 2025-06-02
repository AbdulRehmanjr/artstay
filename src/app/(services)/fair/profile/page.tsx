import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  Binoculars,
  Compass,
  Languages,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { FairEvent } from "~/components/fair/fair-event";


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
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
                {fair.firstName} {fair.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "events", label: "Fair Events" },

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
                    <span className="text-base font-medium">
                      Fair Management
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Languages</span>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      English, Hindi
                    </span>
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
            <FairEvent event={event} key={event.eventId} />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
}
