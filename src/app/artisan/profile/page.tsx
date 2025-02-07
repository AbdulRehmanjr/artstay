import { Checkbox } from "@radix-ui/react-checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";

type PageProps = {
  searchParams: Promise<{ artisanId: string }>;
};

export default async function ArtisanPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const artisan = await api.artisan.getArtisanDetail({
    artisanId: paramProps.artisanId,
  });

  return (
    <Tabs defaultValue="portfolio" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative h-[15rem] w-[15rem] -mt-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={artisan.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 h-[6rem] left-0 right-0 bg-gradient-to-t from-[#9a5d33] to-transparent p-4">
              <h2 className="text-2xl font-semibold text-center text-white">
                {artisan.firstName} {artisan.lastName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap justify-end items-end gap-2 bg-transparent p-0">
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
        <TabsContent value="general"></TabsContent>
        <TabsContent value="portfolio"></TabsContent>
        <TabsContent value="packages"></TabsContent>
        <TabsContent value="booking"></TabsContent>
      </div>
    </Tabs>
  );
}
