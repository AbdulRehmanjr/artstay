import { Banner } from "~/components/common/banner";
import { businessBanner } from "~/constants/banner";

export default function ArtisanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Banner banner={businessBanner} />
      <section className="mx-auto max-w-7xl">{children}</section>
    </>
  );
}
