import { Banner } from "~/components/common/banner";
import { businessBanner } from "~/constants/banner";

export default function LanguageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // TODO: add travlebanner
    <>
      <Banner banner={businessBanner} />
      <section className="mx-auto max-w-7xl mb-32">{children}</section>
    </>
  );
}
