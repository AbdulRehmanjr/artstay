import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import {  TourCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { tourBanner } from "~/constants/banner";
import { TourForm } from "~/components/landing/tour/form";

export const TourLanding = () => {
  return (
    <>
      <Banner banner={tourBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <TourForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Traditional Tour
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Kashmir has surged to become the most Googled Travel Destination,
            dethroning the iconic Swiss Alps.
          </h3>
          <p className="font-text">
            Kashmir Traditional Tour brings a fresh and compelling narrative to
            various aspects of tourism by combining adventure, nature, culinary
            delights, historical and cultural insights, archaeological
            exploration, and resort relaxation with traditional Kashmiri
            practices and values. This approach not only enriches the tourist
            experience but also supports the preservation and promotion of
            Kashmir’s unique cultural heritage.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose{" "}
            <strong className="text-secondary">Kashmir as destination</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              Kashmir is a global tourism hub, Numbers tell our story, Welcomes
              1.2 million tourists annually! Kashmir has everything queer
              travelers want.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TourCardData.map((benefit, index) => (
              <div
                className="group grid place-items-center gap-4 rounded-lg border p-6 transition-colors hover:bg-primary"
                key={index}
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="transition-colors [&>stroke]:fill-white group-hover:[&>stroke]:fill-white"
                    sizes="100%"
                  />
                </div>
                <h4 className="max-w-[13rem] text-center font-heading text-xl font-bold text-primary transition-colors group-hover:text-white">
                  {benefit.title}
                </h4>
                <p className="text-center font-text transition-colors group-hover:text-white">
                  {benefit.des}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CenterSection>
    </>
  );
};
