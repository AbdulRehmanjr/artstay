// import Image from "next/image";
import { CenterSection } from "~/components/common/center-section";
import { SafariCardData } from "~/constants/card";
import { SafariForm } from "~/components/landing/safari/form";
import { Banner } from "~/components/common/banner";
import { safariBanner } from "~/constants/banner";

export const SafariLanding = () => {
  return (
    <>
      <Banner banner={safariBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <SafariForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Craft Safari
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Guided tours of artisan villages, offering firsthand look at the
            crafting process & opportunities to interact
          </h3>
          <p className="font-text">
            Kashmir Craft Safaria is an immersive initiative designed to
            celebrate and preserve the rich cultural heritage of Kashmiri
            crafts. Kashmir Craft Safaria aims to create a sustainable and
            impactful tourism experience that not only enriches the visitors&apos;
            understanding of Kashmiri culture but also empowers local artisans
            and contributes to the preservation of Kashmir&apos;s rich craft
            heritage. Educate visitors about the history, techniques, and
            significance of Kashmiri crafts. Enhanced tourism appeal, cultural
            heritage preservation, and economic benefits.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose{" "}
            <strong className="text-secondary">Kashmir Craft Safari </strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              Participate in responsible tourism that directly benefits local
              communities. Ensure your travel contributes to the preservation of
              cultural heritage and economic sustainability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SafariCardData.map((benefit, index) => (
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
