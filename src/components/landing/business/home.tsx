// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { BusinessCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { businessBanner } from "~/constants/banner";
import { BusinessForm } from "~/components/landing/business/form";

export const BusinessLanding = () => {
  return (
    <>
      <Banner banner={businessBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <BusinessForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Craft Business Directory
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Comprehensive resource connecting artisans, businesses, & consumers
            within the Kashmiri craft industry.
          </h3>
          <p className="font-text">
            The Kashmir Craft Business Directory is an invaluable tool designed
            to help consumers find and purchase authentic, high-quality Kashmiri
            crafts from verified artisans and businesses. Advanced search and
            filter options allow you to quickly find specific crafts or artisans
            based on your preferences. Find artisans and craft businesses near
            you, making it easy to shop locally and support genuine artisan
            community. Shop with confidence knowing that all products are
            evaluated for authenticity and quality by Hamadan Craft Revival
            Foundation.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose{" "}
            <strong className="text-secondary">
              Kashmir Craft Business Directory
            </strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              The directory serve as a trusted source for authentic Kashmiri
              handicrafts, helping to combat the issue of counterfeit products.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BusinessCardData.map((benefit, index) => (
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
