// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { TransitCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { transitBanner } from "~/constants/banner";
import { TransitForm } from "~/components/landing/transist/form";

export const TransitLanding = () => {
  return (
    <>
      <Banner banner={transitBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <TransitForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Eco Transit
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Sustainable transportation through Kashmir&apos;s majestic landscapes
          </h3>
          <p className="font-text">
            Our Eco Transit service provides carbon-conscious travel between Kashmir&apos;s 
            top destinations using electric vehicles and biofuel-powered shuttles. 
            Enjoy comfortable, low-emission journeys while reducing your environmental 
            impact. With scheduled routes and on-demand bookings, we make sustainable 
            travel convenient without compromising on the breathtaking views Kashmir 
            is famous for.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose <strong className="text-secondary">Eco Transit</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              We combine environmental responsibility with reliable transportation, 
              offering the greenest way to explore Kashmir.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TransitCardData.map((benefit, index) => (
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