import { Banner } from "~/components/common/banner";
import { businessBanner } from "~/constants/banner";

export default function ArtisanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  //TODO: Add dining banner
  return (
    <>
      {/* TODO: Add dining banner */}
      <Banner banner={businessBanner} />
      <section className="mx-auto max-w-7xl mb-32">{children}</section>
    </>
  );
}
