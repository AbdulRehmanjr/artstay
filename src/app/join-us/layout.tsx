import { type Metadata } from "next";
import Image from "next/image";
import { Center } from "~/components/common/center-container";
import { Button } from "~/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin, Users, Globe, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "ARTSTAY | JOIN US",
  description: "Join ArtStay's Vendor Partnership Program - Uniting Craftsmanship and Tourism in Kashmir",
};

export default function JoinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <section className="grid gap-16">
        {/* Hero Section */}
        <div className="relative grid h-[20rem] place-content-center overflow-hidden rounded-b-3xl bg-[url('/images/join.jpeg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/70 before:to-primary/50">
          <div className="relative z-10 text-center">
            <h2 className="font-heading text-5xl font-extrabold text-white md:text-6xl">
              Join Us
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Be part of Kashmir&apos;s cultural renaissance
            </p>
          </div>
        </div>

        <Center className="my-5 grid gap-16 p-5">
          {/* Introduction Section */}
          <div className="grid place-items-center gap-8">
            <div className="space-y-2 text-center">
              <p className="font-text text-lg font-extrabold text-secondary">
                Largest Shared Vision Kashmir&apos;s Handicraft-Tourism Convergence
                Program
              </p>
              <h1 className="max-w-lg text-center font-heading text-4xl font-extrabold text-primary">
                Welcome to the ArtStay Vendor Partnership Program!
              </h1>
            </div>
            <p className="max-w-3xl text-center font-text text-lg text-gray-800">
              Uniting Craftsmanship and Tourism for Kashmir&apos;s Cultural
              Renaissance.
            </p>
          </div>

          {/* Main Description */}
          <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md">
            <p className="font-text text-gray-700">
              ArtStay is an innovative initiative designed to bridge the world of
              traditional Kashmiri crafts with global tourism. By partnering with
              artisans, cultural enthusiasts, and businesses, we create unique,
              immersive experiences that allow visitors to not only witness but
              also participate in the rich cultural heritage of Kashmir. As an
              ArtStay Vendor Partner, you become a vital part of this mission. Our
              program is tailored to collaborate with a diverse range of vendors,
              including artisans, craft business owners, photographers,
              videographers, translators, and event organizers. Together, we aim
              to offer tourists an authentic and enriching experience, showcasing
              the beauty and intricacy of Kashmiri crafts. By joining our network,
              you gain access to a platform that connects you with a global
              audience eager to explore and appreciate the artistry and traditions
              of Kashmir. Whether you provide craft demonstrations, manage tours,
              or document these experiences, your role is crucial in preserving
              and promoting Kashmiri culture.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid gap-8">
            <h2 className="text-center font-heading text-3xl font-bold text-primary">
              Amazing Places To Enjoy Your Travel
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Services Description */}
              <div className="space-y-4 rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                <h3 className="font-heading text-2xl font-bold text-primary">
                  We Provide Best Services
                </h3>
                <p className="font-text text-gray-700">
                  We invite you to explore this opportunity to expand your
                  reach, collaborate with like-minded professionals, and
                  contribute to a meaningful cause. Let&apos;s work together to
                  create memorable experiences that celebrate the craftsmanship
                  and cultural heritage of Kashmir.
                </p>
                <Button className="group gap-2 transition-all duration-300 hover:scale-105">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative h-[12rem] w-full overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-primary/50 to-primary/50 transition-opacity duration-300 group-hover:opacity-70" />
                  <Image
                    src="/images/tour.png"
                    alt="tour image for artstay"
                    fill
                    sizes="100%"
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="group relative h-[12rem] w-full overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-primary/50 to-primary/50 transition-opacity duration-300 group-hover:opacity-70" />
                  <Image
                    src="/images/tour.png"
                    alt="tour image for artstay"
                    fill
                    sizes="100%"
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="rounded-xl bg-primary/5 p-8">
            <h3 className="mb-6 text-center font-heading text-2xl font-bold text-primary">
              Why Join ArtStay?
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Globe className="h-5 w-5" />, text: "Global Reach" },
                { icon: <Users className="h-5 w-5" />, text: "Community Support" },
                { icon: <MapPin className="h-5 w-5" />, text: "Local Presence" },
                { icon: <Heart className="h-5 w-5" />, text: "Cultural Impact" },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-transform duration-300 hover:translate-y-1 hover:shadow-md"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Children Content */}
          {children}
        </Center>
      </section>
    </>
  );
}
