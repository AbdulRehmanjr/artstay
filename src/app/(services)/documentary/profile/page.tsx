import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  FileText,
  Camera,
  Languages,
  Package,
  CheckCircle2,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { DocumentorPackageCard } from "~/components/documentary/documentor-card";
import { DocumentorPortfolio } from "~/components/documentary/documentr-portfolio";


type PageProps = {
  searchParams: Promise<{ documentorId: string }>;
};

export default async function DocumentorPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const documentor: DocumentorDetailProps = await api.documentor.getDocumentorDetail({
    documentorId: paramProps.documentorId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={documentor.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
                {documentor.firstName} {documentor.lastName}
              </h2>
            </div>
            {documentor.isActive && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                  <CheckCircle2 className="h-3 w-3" />
                  Available
                </div>
              </div>
            )}
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "packages", label: "Packages" },
              { id: "portfolio", label: "Portfolio" },
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
                      <span className="text-base font-medium">
                        {documentor.yearsExperience}+ Years
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Total Packages</span>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {documentor.DocumentorPackage.length} Packages Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">Specializations</span>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">
                      {documentor.specialization.slice(0, 2).join(", ")}
                      {documentor.specialization.length > 2 && ` +${documentor.specialization.length - 2} more`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Craft Focus</span>
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-pink-400" />
                    <span className="text-base font-medium">
                      {documentor.craftFocusAreas.slice(0, 2).join(", ")}
                      {documentor.craftFocusAreas.length > 2 && ` +${documentor.craftFocusAreas.length - 2} more`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Languages</span>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {documentor.languages.slice(0, 3).join(", ")}
                      {documentor.languages.length > 3 && ` +${documentor.languages.length - 3} more`}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{documentor.address}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Documentor
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {documentor.description}
            </p>
          </div>

          {/* Skills and Expertise */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {documentor.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Craft Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {documentor.craftFocusAreas.map((area, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="grid gap-6">
          <HeadlingUnderline title="Available Packages" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documentor.DocumentorPackage.map((pkg) => (
              <DocumentorPackageCard package={pkg} key={pkg.packageId} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="grid gap-6">
          <HeadlingUnderline title="Portfolio" />
          {documentor.DocumentorPortfolio ? (
            <DocumentorPortfolio portfolio={documentor.DocumentorPortfolio} />
          ) : (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Available</h3>
              <p className="text-gray-500">This documentor hasn&apos;t uploaded their portfolio yet.</p>
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}