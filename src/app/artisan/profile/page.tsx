import { Checkbox } from "@radix-ui/react-checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  Trophy,
  Award,
  MapPin,
  Star,
  GraduationCap,
  BookOpen,
  Clock,
  Medal,
  Scroll,
  Expand,
  Eye,
} from "lucide-react";
import {
  getCertificateString,
  getEducationString,
  getExperienceString,
  getRecognitionString,
  getTrainingString,
} from "~/lib/utils";
import { ArtisanCalendar } from "~/components/artisans/artisan-calendar";

type PageProps = {
  searchParams: Promise<{ artisanId: string }>;
};

export default async function ArtisanPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const artisan = await api.artisan.getArtisanDetail({
    artisanId: paramProps.artisanId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[15rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={artisan.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[6rem] bg-gradient-to-t from-[#9a5d33] to-transparent p-4">
              <h2 className="text-center text-2xl font-semibold text-white">
                {artisan.firstName} {artisan.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "portfolio", label: "Portfolio" },
              { id: "packages", label: "Packages" },
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
          <h2 className="relative inline-block text-2xl font-semibold text-gray-800">
            General Information
            <div className="absolute -bottom-2 left-0 h-1 w-24 bg-primary" />
          </h2>
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
                    <span className="text-xs text-white/70">
                      Craft Specialization
                    </span>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-base font-medium">
                        {artisan.craft.craftName} |{" "}
                        {artisan.subCraft.subCraftName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">
                      Education Type
                    </span>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {getEducationString(
                          artisan.training as TraingEducationEnum,
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">
                      Training Background
                    </span>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-400" />
                      <span className="text-base font-medium">
                        {getTrainingString(
                          artisan.training as TraingEducationEnum,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">
                    Experience Level
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="text-base font-medium">
                      {getExperienceString(
                        artisan.experience as ExperienceEnum,
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Certification</span>
                  <div className="flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {getCertificateString(
                        artisan.experience as CertificationEnum,
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">
                    Recognition Level
                  </span>
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-red-400" />
                    <span className="text-base font-medium">
                      {getRecognitionString(
                        artisan.recongnition as RecongnitionEnum,
                      )}
                    </span>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">Srinagar, Kashmir, INDIA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              Artisan General Information
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {artisan.description ||
                "Blending traditional and modern techniques"}
            </p>
          </div>
        </TabsContent>
        <TabsContent
          value="portfolio"
          className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <h2 className="relative col-span-full mb-8 inline-block text-2xl font-semibold text-gray-800">
            My Portfolio
            <div className="absolute -bottom-2 left-0 h-1 w-24 bg-primary" />
          </h2>
          {artisan.Portfolio.images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative h-[17rem] w-full">
                <Image
                  src={image}
                  alt={`Portfolio image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index < 4} // Prioritize loading first 4 images
                />
              </div>

              {/* Optional: Image Number Badge */}
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 shadow-md">
                {index + 1}/{artisan.Portfolio.images.length}
              </div>
            </div>
          ))}

          {/* Loading State Placeholder */}
          {artisan.Portfolio.images.length === 0 && (
            <div className="col-span-full flex h-[17rem] items-center justify-center rounded-xl bg-gray-100">
              <p className="text-gray-500">No portfolio images available</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="packages"></TabsContent>
        <TabsContent value="booking" className="grid gap-8">
          <h2 className="relative col-span-full inline-block text-2xl font-semibold text-gray-800">
            Booking
            <div className="absolute -bottom-2 left-0 h-1 w-24 bg-primary" />
          </h2>
          <ArtisanCalendar/>
        </TabsContent>
      </div>
    </Tabs>
  );
}
