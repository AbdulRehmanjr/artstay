import Image from "next/image";
import { Banner } from "~/components/common/banner";
import { CenterSection } from "~/components/common/center-section";
import { ArtsayComingSoon } from "~/components/common/coming-soon";
import { ArtisanForm } from "~/components/landing/artisans/form";
import { landingBanner } from "~/constants/banner";
import { ArtisanCardData } from "~/constants/card";

export const ArtisanLanding = () => {
  return (
    <>
      <Banner banner={landingBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <div className="col-span-2">
          <ArtsayComingSoon />
        </div>
        <ArtisanForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Vacation with Kashmiri Artisan
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Embark on a journey of craft learning, support & connection with
            Kashmir artisans.
          </h3>
          <p className="font-text">
            Kashmir, referred to as the &quots;Mecca of Artisans,&quots; is celebrated for
            its unparalleled craftsmanship and the exquisite artistry of its
            traditional crafts. Where tradition meets timeless elegance and
            important Silk route historical connection. Designated as a part of
            the UNESCO Creative Cities Network under the category of &quots;Crafts and
            Folk Art.&quots; Also recognized as a ‘World Crafts City’ by the World
            Craft Council (WCC). 3,50,000 Kashmiri artisans have garnered global
            recognition due to their exceptional skill, dedication to
            traditional craftsmanship, and the unique qualities of their
            handmade products
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Choose{" "}
            <strong className="text-secondary">Kashmir Artisans</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              Choosing Kashmiri artisans for your vacation providing a unique
              opportunity to learn from skilled craftsmen, and understand the
              stories behind their art.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ArtisanCardData.map((benefit, index) => (
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
