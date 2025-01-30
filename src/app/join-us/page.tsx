import Image from "next/image";
import Link from "next/link";
import { Center } from "~/components/common/center-container";
import { Button } from "~/components/ui/button";
import { JoinCard } from "~/constants/card";

export default function JoinPage() {
  return (
    <section className="grid gap-24">
      <div className="relative grid h-[17rem] place-content-center bg-[url('/images/join.jpeg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/50 before:to-primary/50">
        <h2 className="font-extraboldS relative font-heading text-4xl text-white">
          Join Us
        </h2>
      </div>
      <Center className="my-5 grid gap-24 p-5">
        <div className="grid place-items-center gap-8">
          <div className="space-y-2">
            <p className="font-text font-extrabold text-secondary">
              Largest Shared Vision Kashmir's Handicraft-Tourism Convergence
              Program
            </p>
            <h1 className="max-w-lg text-center font-heading text-3xl font-extrabold text-primary">
              Welcome to the ArtStay Vendor Partnership Program!
            </h1>
          </div>
          <p className="font-text text-gray-800">
            Uniting Craftsmanship and Tourism for Kashmir's Cultural
            Renaissance.
          </p>
        </div>
        <p className="font-text text-gray-700">
          ArtStay is an innovative initiative designed to bridge the world of
          traditional Kashmiri crafts with global tourism. By partnering with
          artisans, cultural enthusiasts, and businesses, we create unique,
          immersive experiences that allow visitors to not only witness but also
          participate in the rich cultural heritage of Kashmir. As an ArtStay
          Vendor Partner, you become a vital part of this mission. Our program
          is tailored to collaborate with a diverse range of vendors, including
          artisans, craft business owners, photographers, videographers,
          translators, and event organizers. Together, we aim to offer tourists
          an authentic and enriching experience, showcasing the beauty and
          intricacy of Kashmiri crafts. By joining our network, you gain access
          to a platform that connects you with a global audience eager to
          explore and appreciate the artistry and traditions of Kashmir. Whether
          you provide craft demonstrations, manage tours, or document these
          experiences, your role is crucial in preserving and promoting Kashmiri
          culture.
        </p>
        <div className="grid gap-6">
          <p className="font-text">Amazing Places To Enjony Your Travel</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-3 xl:col-span-1">
              <h2 className="font-heading text-3xl">
                We Provide Best Services
              </h2>
              <p className="font-text">
                We invite you to explore this opportunity to expand your reach,
                collaborate with like-minded professionals, and contribute to a
                meaningful cause. Let’s work together to create memorable
                experiences that celebrate the craftsmanship and cultural
                heritage of Kashmir.
              </p>
              <Button className="">Read more</Button>
            </div>
            <div className="col-span-2 flex gap-2 xl:col-span-1">
              <div className="relative h-[10rem] w-[16rem]">
                <div className="absolute inset-0 z-10 rounded-lg bg-gradient-to-b from-primary/50 to-primary/50" />
                <Image
                  src="/images/tour.png"
                  alt="tour image for artstay"
                  fill
                  sizes="100%"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="relative h-[10rem] w-[16rem]">
                <div className="absolute inset-0 z-10 rounded-lg bg-gradient-to-b from-primary/50 to-primary/50" />
                <Image
                  src="/images/tour.png"
                  alt="tour image for artstay"
                  fill
                  sizes="100%"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <h3 className="font-heading text-3xl">
            What <span className="text-secondary">Describes</span> You The Best?
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {JoinCard.map((card, index) => (
              <div
                className="col-span-3 grid gap-4 border rounded-lg xl:col-span-1 p-4 place-content-center place-items-center"
                key={index}
              >
                <h4 className="font-heading font-extrabold text-xl text-primary text-center max-w-[13rem]">{card.title}</h4>
                <p className="font-text text-center  max-w-xs">{card.description}</p>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href={card.link}>Learn More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Center>
    </section>
  );
}
