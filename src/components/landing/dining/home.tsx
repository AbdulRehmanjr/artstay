// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { DiningCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { diningBanner } from "~/constants/banner";
import { DiningForm } from "~/components/landing/dining/form";

export const DiningLanding = () => {
  return (
    <>
      <Banner banner={diningBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <DiningForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Dining Voyage
          </h2>
          <h3 className="font-heading text-xl font-bold">
            A gastronomic journey through Kashmir&apos;s culinary heritage
          </h3>
          <p className="font-text">
            Our Dining Voyage offers an unparalleled culinary adventure across Kashmir&apos;s 
            most breathtaking locations. From floating restaurants on Dal Lake to 
            mountaintop dining with panoramic views, each experience combines authentic 
            Kashmiri cuisine with unforgettable settings. Savor traditional Wazwan feasts, 
            organic farm-to-table meals, and modern Kashmiri fusion - all prepared by 
            master chefs using locally-sourced ingredients.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose <strong className="text-secondary">Dining Voyage</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              We redefine culinary tourism by combining exceptional food with extraordinary 
              locations and cultural immersion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DiningCardData.map((benefit, index) => (
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