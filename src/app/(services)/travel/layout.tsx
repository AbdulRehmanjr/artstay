import { Banner } from "~/components/common/banner";
import { safariBanner } from "~/constants/banner";

export default function TravelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // TODO: add travlebanner
    <>
      <Banner banner={safariBanner} />
      <section className="mx-auto max-w-7xl mb-32">{children}</section>
    </>
  );
}
