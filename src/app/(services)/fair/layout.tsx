import { Banner } from "~/components/common/banner";
import { fairBanner } from "~/constants/banner";

export default function ArtisanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Banner banner={fairBanner} />
      <section className="mx-auto max-w-7xl mb-32">{children}</section>
    </>
  );
}
