import { CenterSection } from "~/components/common/center-section";
import { LanguageCardData } from "~/constants/card";
import { Banner } from "~/components/common/banner";
import { languageBanner } from "~/constants/banner";
import { LanguageForm } from "~/components/landing/language/form";

export const LanguageLanding = () => {
  return (
    <>
      <Banner banner={languageBanner} />
      <CenterSection className="grid grid-cols-2 gap-10 p-6">
        <LanguageForm />
        <div className="col-span-2 grid place-content-end gap-3 lg:col-span-1">
          <h2 className="font-heading text-4xl font-extrabold text-secondary">
            Kashmir Language Services
          </h2>
          <h3 className="font-heading text-xl font-bold">
            Bridge the language gap during your Kashmir visit
          </h3>
          <p className="font-text">
            Our professional interpreters and translators help you communicate effortlessly 
            throughout your Kashmir journey. Whether you need a tour guide interpreter, 
            document translation, or emergency language assistance, our native-speaking 
            professionals ensure accurate and culturally-appropriate communication in 
            Kashmiri, Urdu, Hindi, and other major languages.
          </p>
        </div>
        <div className="col-span-2 grid gap-8">
          <h2 className="text-center font-heading text-4xl font-extrabold">
            Why Use Our <strong className="text-secondary">Language Services</strong>
          </h2>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center font-text text-sm">
              We go beyond simple translation to ensure meaningful cultural exchange 
              and accurate communication in every situation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LanguageCardData.map((benefit, index) => (
              <div
                className="group grid place-items-center gap-4 rounded-lg border p-6 transition-colors hover:bg-primary"
                key={index}
              >
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