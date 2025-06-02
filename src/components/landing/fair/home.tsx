// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { FairCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { fairBanner } from "~/constants/banner";
import { FairForm } from "~/components/landing/fair/form";

export const FairLanding = () => {
  return (
    <>
      <Banner banner={fairBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <FairForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
          Kashmir Craft Fair
          </h2>
          <h3 className="font-heading text-xl font-bold">
          Vibrant events bringing together artisans & craft enthusiasts, platform celebrating contemporary crafts
          </h3>
          <p className="font-text">
          Kashmir craft fairs offer a unique blend of historical significance, high-quality artistry, diverse craftsmanship, immersive cultural experiences, and strong community engagement, making them a distinct and enriching experience for visitors. The fairs/exhibitions/museums feature a wide range of crafts, including textiles, woodwork, metalwork, jewelry, and more, showcasing the diverse artistic talents of Kashmir. The crafts often blend influences from various cultures and historical periods, creating unique and distinctive pieces.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose{" "}
            <strong className="text-secondary">Kashmir Craft Fair/Exhibition</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
            Your participation helps sustain traditional crafts, providing artisans with a platform to display their work and ensuring these age-old practices are preserved for future generations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FairCardData.map((benefit, index) => (
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
