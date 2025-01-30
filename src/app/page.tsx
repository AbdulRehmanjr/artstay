import { ArtisanLanding } from "~/components/landing/artisans/home";
import { BusinessLanding } from "~/components/landing/business/home";
import { FairLanding } from "~/components/landing/fair/home";
import { SafariLanding } from "~/components/landing/safari/home";
import { TourLanding } from "~/components/landing/tour/home";

export default  function HomePage() {
  return (
    <>
      <ArtisanLanding />
      <SafariLanding />
      <FairLanding />
      <BusinessLanding />
      <TourLanding />
    </>
  );
}
