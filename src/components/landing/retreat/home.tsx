// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { Banner } from "~/components/common/banner";
import { retreatBanner } from "~/constants/banner";
import { RetreatForm } from "~/components/landing/retreat/form";
import { RetreatCardData } from "~/constants/card";

export const RetreatLanding = () => {
  return (
    <>
      <Banner banner={retreatBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <RetreatForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Eco Retreat
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Sustainable luxury amidst Kashmir&apos;s pristine nature
          </h3>
          <p className="font-text">
            Nestled in the heart of Kashmir&apos;s breathtaking landscapes, our Eco Retreat offers 
            an immersive experience that harmonizes luxury with sustainability. Stay in our 
            eco-friendly cottages built with local materials, enjoy organic farm-to-table cuisine, 
            and reconnect with nature through guided eco-tours. We&apos;re committed to preserving 
            Kashmir&apos;s natural beauty while providing unforgettable experiences that leave minimal 
            environmental impact.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose Our <strong className="text-secondary">Eco Retreat</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              We combine sustainable practices with authentic Kashmiri hospitality to create 
              experiences that are good for you and the planet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RetreatCardData.map((benefit, index) => (
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