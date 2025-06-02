// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { PlannerCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { plannerBanner } from "~/constants/banner";
import { PlannerForm } from "~/components/landing/planner/form";

export const PlannerLanding = () => {
  return (
    <>
      <Banner banner={plannerBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <PlannerForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Travel Planner
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Your complete guide to authentic Kashmiri experiences
          </h3>
          <p className="font-text">
            Our Travel Planner helps you design the perfect Kashmir itinerary combining 
            cultural immersion, sustainable stays, culinary adventures, and eco-friendly 
            transportation. Whether you&apos;re seeking artisan workshops, mountain retreats, 
            or houseboat dining, we&apos;ll help you craft a personalized journey that 
            respects local traditions and the environment.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Use Our <strong className="text-secondary">Travel Planner</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              We handle the logistics so you can focus on experiencing Kashmir&apos;s magic - 
              all while ensuring your visit benefits local communities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PlannerCardData.map((benefit, index) => (
              <div
                className="group grid place-items-center gap-4 rounded-lg border p-6 transition-colors hover:bg-primary"
                key={index}
              >
                {/* <div className="relative h-16 w-16">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="transition-colors [&>stroke]:fill-white group-hover:[&>stroke]:fill-white"
                    sizes="100%"
                  />
                </div> */}
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